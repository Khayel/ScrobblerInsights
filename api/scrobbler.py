
# TODO Redo tables with relevant data...for Tableau analytics and additional data
# TODO user authentication

#TODO embed tableau 
#TODO user implementation
import requests
import pandas as pd
import dbconnection as db
from datetime import datetime
API_KEY = "8f17f6e08c0b52d7a6e0388750ca746b"
SECRET = "c14bdb3a0b57d7504fb55ac43dde48d0"
USER = "khayelc"


def get_recent_tracks_full(username):
    #TODO add check for non existing user.
    conn = db.DB_connection()
    user_id = conn.new_user(username)
    #FIXME implement return of new user of user id
    # user_id = conn.new_user(username)
    # only use for initial run.
    r = requests.get(
        "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={}&api_key={}&format=json&limit=200".format(username, API_KEY))
    results = r.json()
    total_pages = results['recenttracks']['@attr']['totalPages']
    print(f"There are {total_pages} pages")
    for page in range(2, int(total_pages) + 1):
        print("on page: " + str(page))
        r = requests.get(
            "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={}&api_key={}&format=json&limit=200&page={}".format(username, API_KEY, page))
        results['recenttracks']['track'] = results['recenttracks']['track'] + \
            r.json()['recenttracks']['track']
    print(len(results['recenttracks']['track']))
    conn.update_tracks_played(results['recenttracks']['track'],user_id)
    return user_id


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
    #TODO only updated if not updated for x minutes in user_id find create last updated column... create a last checked column for the user
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
                        conn.update_tracks_played(new_tracks,user_id)
                        return True
                    else:
                        print("No new tracks...")
                        return False

            new_tracks += tracks_on_page
    return False

def is_existing_user(username):
    conn = db.DB_connection()
    return conn.is_existing_user(username)

def get_played_tracks(user_id):
    conn = db.DB_connection()
    return conn.get_all_user_tracks(user_id)


def output_csv(tracks_played, track_info):
    """Given list of tracks played and track information, create a CSV using dataframes"""
    df = pd.DataFrame(columns=['Track', 'Artist', 'Date'])

    for track in tracks_played:
        # add additional data required here.
        try:
            item = pd.DataFrame([[track['name'], track['artist']['#text'],
                                track['date']['#text']]], columns=['Track', 'Artist', 'Date'])
        except KeyError:
            # FIXME if a track is currently playing, this exception should only be thrown once, but is thrown ~6 times
            if 'date' not in track.keys():
                print(f"{track['name']} is currently playing... getting current time")
                curr_time = datetime.now()
                item = pd.DataFrame([[track['name'], track['artist']['#text'], curr_time.strftime(
                    "%d %b %Y, %H:%M")]], columns=['Track', 'Artist', 'Date'])
        df = pd.concat([df, item], ignore_index=True)
    print(df.to_string())
    df.to_csv('playhistory.csv')

def create_list():
    global API_KEY
    global SECRET
    global USER

    API_KEY = "8f17f6e08c0b52d7a6e0388750ca746b"
    SECRET = "c14bdb3a0b57d7504fb55ac43dde48d0"
    USER = "khayelc"
    
    conn = db.DB_connection()
    return conn.get_all_tracks()
