# TODO user case to create a scrobbler account
from flask import Flask
from flask.templating import render_template
import scrobbler
import threading
import config
app = Flask(__name__)


@app.route("/")
def index():
    # stats page for me?
    return render_template("index.html")


@app.route("/gethistory")
def get_play_history():
    trackList = scrobbler.create_list()
    return str(trackList)


@app.route('/user/<username>')
def get_username(username):
    username = username.lower()
    user_id = scrobbler.is_existing_user(username)
    #TODO is existing user should also return last update and only call update tracks if certain time elapsed.

    if user_id:
        th_update_tracks_existing_user = threading.Thread(target=scrobbler.update_recent_tracks_incremental, args=((username,user_id)))
        th_update_tracks_existing_user.start()
    else:
        try:
            th_update_tracks_new_user = threading.Thread(target=scrobbler.get_recent_tracks_full, args=((username,)))
            th_update_tracks_new_user.start()
            return "New user please try again later while data is gathered"
            # user_id = scrobbler.get_recent_tracks_full(username)
        except:
            return "Error"
    response = {'username': username,
                'user_id': user_id,
            'tracks_played': scrobbler.get_played_tracks(user_id)}
    return response



@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response



if __name__=="__main__":
    app.secret_key = config.APP_SECRET
    app.run(debug=True, host='0.0.0.0', port=5001)