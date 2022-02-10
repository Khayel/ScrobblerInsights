# ScrobblerInsights
Check it out [here!](https://listenerinsights.s3.amazonaws.com/index.html)

## Decription
See my song play history and some data visualizations such as genre ranks over time, top artists, and my listening habits at different times of day.

## Overview
### Technologies used:
- React
- Tableau JS API
- Flask
- Last.fm API
- Spotify API
- PostgreSQL

This web app uses React and the Tableau JS API to embed a dashboard from Tableau Public. On page load, retrieve data from the Flask backend.
The Flask backend provides data for the React app, updates the listening history, gathers additional information for the data visualizations,
and is responsible for the ETL into a PostgreSQL database.

