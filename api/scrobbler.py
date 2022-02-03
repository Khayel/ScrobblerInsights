
# TODO Redo tables with relevant data...for Tableau analytics and additional data
# TODO user authentication

#TODO embed tableau 
#TODO user implementation
import requests
import pandas as pd
import dbconnection as db
from datetime import datetime
import threading
import base64

API_KEY = "8f17f6e08c0b52d7a6e0388750ca746b"
SECRET = "c14bdb3a0b57d7504fb55ac43dde48d0"
SPOTIFY_CLIENT_ID = "6a2e3c67318242efada57ffb80ea4ec7"
SPOTIFY_SECRET = "98638d4147bd4c3db49d3ab38759b9b7"



def get_recent_tracks_full(username,user_id):
    #TODO add check for non existing user.
    conn = db.DB_connection()
    #FIXME implement return of new user of user id
    # user_id = conn.new_user(username)
    # only use for initial run.
    r = requests.get(
            "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={}&api_key={}&format=json&limit=200".format(username, API_KEY))
    num_pages = r.json()['recenttracks']['@attr']['totalPages']
    print(
            f"There are {num_pages} pages")
    
    for page in range(1, int(num_pages)+1):
        print("on page: " + str(page))
        new_tracks = []
        r = requests.get(
                "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={}&api_key={}&format=json&limit=200&page={}".format(username, API_KEY, page))
        tracks_on_page = r.json()['recenttracks']['track']
        for ind, track in enumerate(tracks_on_page):
            new_tracks.append(track)
        if new_tracks:
                artists = [artist['artist']['#text'] for artist in new_tracks]
                conn.update_tracks_played(new_tracks,user_id)
                        #only care about unique artist to improve speed of genre gathering...
                        #TODO update tracksp playes should be updated to use artist_id...
                artists = set(artists)
                        #this takes time so do in another thread...
                th = threading.Thread(target=get_genres, args=(set(artists),))
                th.start()
        else:
                print("No new tracks...")
                return False 
    return True


def get_track_info(track):
    #TODO given track and artist get duration,toptags.
    """Given an input of tracks items based on last.fm, get track info if available else None and return dict with song name key and trackinfo json object as value"""
    track_info = {}
    try:
        track_details = requests.get('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key={}&artist={}&track={}&format=json'.format(API_KEY, track['artist']['#text'],)).json()
    except:
        track_details = None
    track_info[track['name']] = track_details
    return track_info
    


def update_recent_tracks_incremental(username,user_id):
    #TODO only updated if not updated for x minutes in user_id find create last updated column...
    print(f"Updating track list for user {username}")
    conn = db.DB_connection()
    recent_track = conn.get_most_recent_track(username)
    #TODO condition where this is far back?
    if recent_track: 
        # remove None column(user_id?) make datetime consistent
        recent_track_fix = (recent_track[0], recent_track[1], recent_track[3].strftime("%d %b %Y, %H:%M"))
        print("looking for " + str(recent_track_fix))
        r = requests.get(
            "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={}&api_key={}&format=json&limit=200".format(username, API_KEY))
        num_pages = r.json()['recenttracks']['@attr']['totalPages']
        print(
            f"There are {num_pages} pages")
        new_tracks = []
        for page in range(1, int(num_pages)+1):
            print("on page: " + str(page))
            r = requests.get(
                "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={}&api_key={}&format=json&limit=200&page={}".format(username, API_KEY, page))
            tracks_on_page = r.json()['recenttracks']['track']
            for ind, track in enumerate(tracks_on_page):
                if track['name'] == recent_track_fix[0] and track['artist']['#text'] == recent_track_fix[1] and track['date']['#text'] == recent_track_fix[2]:
                    print(f"Found at index {ind} on page {page}...getting list of tracks before and excluding recent track.")
                    new_tracks += tracks_on_page[:ind]
                    if new_tracks:
                        artists = [artist['artist']['#text'] for artist in new_tracks]
                        conn.update_tracks_played(new_tracks,user_id)
                        #only care about unique artist to improve speed of genre gathering...
                        #TODO update tracksp playes should be updated to use artist_id...
                        artists = set(artists)
                        #this takes time so do in another thread...
                        th = threading.Thread(target=get_genres, args=(set(artists),))
                        th.start()
                        return True
                    else:
                        print("No new tracks...")
                        return False
            new_tracks += track
    #update get corresponding genre via spotify api
    #auth

   
    return False

def is_existing_user(username):
    conn = db.DB_connection()
    return conn.is_existing_user(username)

def get_played_tracks(user_id):
    conn = db.DB_connection()
    return conn.get_all_user_tracks(user_id)

def create_list():
    
    conn = db.DB_connection()
    return conn.get_all_tracks()

def get_genres(artists):
    print("getting genres....")
    base64_auth = base64.b64encode(f'{SPOTIFY_CLIENT_ID}:{SPOTIFY_SECRET}'.encode()).decode()
    auth_headers = {
        'Authorization': f'Basic {base64_auth}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    auth_payload = {
    'grant_type': 'client_credentials'
    }
    auth_request = requests.post('https://accounts.spotify.com/api/token',data=auth_payload, headers=auth_headers).json()
    auth_token = auth_request['access_token']

    headers = { 'Authorization': f'Bearer {auth_token}'}
    
    artist_information = {artist: {'genres': []} for artist in artists}
    #get spotify id of artists
    for artist in artists:
        artist_request = requests.get(f"https://api.spotify.com/v1/search?limit=1&type=artist&q={artist.replace(' ','%20')}",headers=headers).json()
        artist_information[artist] = {'genres': artist_request['artists']['items'][0]['genres']}
    
    conn = db.DB_connection()
    for artist in artist_information:
        conn.update_genres(artist, artist_information[artist]['genres'])
        

    #TODO verify if artist or genre is new in artist and genre tables...
    #if new then enter in to table
    #into entries table create new record with id of genre and artist.

    #should modify songs played to use artist_id...
    #for genres by day, join tracks played with the artistgenre based on artist and then get genres using genre id
if __name__ == "__main__":
    #recent_tracks = get_recent_tracks_full()
    #tracks = recent_tracks['recenttracks']['track']
    #print(tracks)
    #print(type(tracks))

    # db.update_tracks_played(tracks)
    get_genres(['Childish Gambino'])
