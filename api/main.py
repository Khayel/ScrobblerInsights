# TODO user case to create a scrobbler account
# TODO visualize data in tableau
# TODO embed tableau dashboard
#FIXME remove case sensitivity for usernames
from os import fsencode
from flask import Flask, request, redirect, jsonify
from flask.templating import render_template
import scrobbler
import json
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
    user_id = scrobbler.is_existing_user(username)
    if user_id:
        scrobbler.update_recent_tracks_incremental(username, user_id)
    else:
        try:
            user_id = scrobbler.get_recent_tracks_full(username)
        except:
            return "Error"
    response = jsonify({'username': username,
            'tracks_played': scrobbler.get_played_tracks(user_id)})
    return response


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response



if __name__=="__main__":
    app.run(debug=True, host='0.0.0.0')