import psycopg2
import configparser
from datetime import datetime


class DB_connection():
    def __init__(self):
        self.config = configparser.ConfigParser()
        self.config.read('config.ini')

    def connect(self):
        return psycopg2.connect(user=self.config['postgres']['user'],
                                password=self.config['postgres']['password'],
                                host=self.config['postgres']['host'],
                                port=self.config['postgres']['port'],
                                database=self.config['postgres']['db_name'])

    def clean_timestamps(self, track,user_id):
        # when a track is currently playing, date field is missing. replaces date part with current system time if track is currently playing.
        # return tuples for database insertion
        try:
            return (track['name'], track['artist']['#text'], track['date']['#text'],user_id)
        except:
            if 'date' not in track.keys():
                print(track['name'] +
                      ' is currently playing... getting current time')
                curr_time = datetime.now()
                return (track['name'], track['artist']['#text'], curr_time.strftime(
                    "%d %b %Y, %H:%M"),user_id)
    def update_tracks_played(self, tracks_played,user_id):
        track_list = [self.clean_timestamps(track,user_id) for track in tracks_played]
        
        #check list of stuff to insert
        # for i in range(len(track_list)-1,-1,-1):
        #     print(str(i) + str(track_list[i]))
        print('Inserting {} new records into the database...'.format(len(track_list)))
        try:
            conn = self.connect()
            cursor = conn.cursor()
            for track in track_list:
                cursor.execute(
                    "INSERT INTO public.songs_played(name,artist,date_played,user_id) VALUES (%s,%s,%s,%s)", (track))
            conn.commit()
            conn.close()
            print("Done.")
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)

    def is_existing_user(self,username):
        try:
            conn = self.connect()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id FROM public.user WHERE username=%s", (username,))
            result = cursor.fetchone()
            conn.commit()
            conn.close()
            return result[0]
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
            return None
            

    def get_most_recent_track(self, username='null'):

        try:
            conn = self.connect()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM public.songs_played INNER JOIN public.user ON public.songs_played.user_id=public.user.id WHERE public.user.username=%s  ORDER BY date_played DESC LIMIT 1", (username,))
            result = cursor.fetchone()
            conn.commit()
            conn.close()
            return result
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
            return None
        finally:
            return result
    def get_all_user_tracks(self, user_id=0):

        try:
            conn = self.connect()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM public.songs_played WHERE user_id=%s ORDER BY date_played DESC",(user_id,))
            result = cursor.fetchall()
            conn.commit()
            conn.close()
            #FIXME return a dict instead
            return [{'id': track[4],
            'name': track[0],
            'artist': track[1],
            'date': track[3].strftime("%d %b %Y, %H:%M")} for track in result]
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
            return None
    def new_user(self, username):
        try:
            conn = self.connect()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO public.user(username) VALUES (%s)",(username,))
            conn.commit()
            cursor.execute("SELECT id FROM public.user WHERE username=%s",(username,))
            result = cursor.fetchone()
            conn.close()
            return result[0]
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
            return None
    def update_genres(self, artist, genres):
        print(f"Inserting {artist}")
        #TODO insert artist and genre, if not exists in artist/genre table, get ID
        try:
            conn = self.connect()
            cursor = conn.cursor()
            cursor.execute("INSERT INTO public.artist(name) VALUES (%s) RETURNING id;",(artist,))
            a_id = cursor.fetchone()[0]
            artist_exists = False
        #already exists
        except psycopg2.IntegrityError:
            print("Already exists")
            conn = self.connect()
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM public.artist WHERE name =%s;",(artist,))
            a_id = cursor.fetchone()[0]
            artist_exists = True
        finally:
            conn.commit()
            conn.close()


        g_ids = []
        for genre in genres:#try threading here?
            try:
                conn = self.connect()
                cursor = conn.cursor()
                cursor.execute("INSERT INTO public.genre(name) VALUES (%s) RETURNING id",(genre,))
                g_ids.append(cursor.fetchone()[0])
            except:
                print("Already exists")
                conn = self.connect()
                cursor = conn.cursor()
                cursor.execute("SELECT id FROM public.artist WHERE name =%s;",(artist,))
                g_ids.append(cursor.fetchone()[0])
            finally:
                conn.commit()
                conn.close()

        #TODO insert into artist_genres a_id and g_id for every g_id
        if not artist_exists:
            for g_id in g_ids:
                conn = self.connect()
                cursor = conn.cursor()
                cursor.execute("INSERT INTO public.artist_genres(a_id,g_id) VALUES (%s,%s)",(a_id,g_id))
                conn.commit()
                conn.close()
        print(f"Done")
        return None
if __name__=="__main__":
    db = DB_connection()
    db.is_existing_user('khayelc')