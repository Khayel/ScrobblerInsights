import React, {useState,useEffect, useRef} from "react"

function TrackList(props){
    console.log(props.tracks)
    return(
        <div classname="tracklistContain">
            <div class="tracklistWrappe">
                <ul classname="timeline">
                    {props.tracks.map( (track) => (
                    <li class="timeline__item">
                        <div class="timeline__step">
                            <div class="timeline__step__marker timeline__step__marker--red"></div>
                        </div>
                        <div class="timeline__time">
                        {track.date}
                        </div>
                        <div class="timeline__content">
                            <div class="timeline__title">
                                {track.name}
                            </div>
                            <div class="timeline__points">
                                {track.artist}
                            </div>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    )

}
export default TrackList