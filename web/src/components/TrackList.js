import React, {useState,useEffect, useRef} from "react"

function TrackList(props){
    console.log(props.tracks)
    return(
        <div classname="tracklistContainer">
            <div class="tracklistWrapper">
            <ul classname="tracksPlayed">
                {props.tracks.map( (track) => (<li>
                     <div className="time">{track.date}</div>
                     <p>{track.name} {track.artist} </p>
                </li>))}
            </ul>
        </div>
        </div>
    )

}
export default TrackList