# TODO user case to create a scrobbler account
# TODO visualize data in tableau
# TODO embed tableau dashboard
from os import fsencode
from flask import Flask, jsonify
from flask.templating import render_template
import scrobbler
app = Flask(__name__)


@app.route("/")
def index():
    # stats page for me?
    return render_template("index.html")



@app.route('/user/<username>')
def get_username(username):
    username = username.lower()
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
    app.run(debug=True, host="0.0.0.0", port=5001)
