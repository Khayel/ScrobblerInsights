import React, {useState} from "react"
import {IoChevronDown, IoChevronUp} from "react-icons/io5"

function Card(props){
    const [displayMode, setDisplayMode] = useState('minimized')
    const [clickedinCard, setClicked] = useState(false)

    const expandCard = (e)=>{
        e.preventDefault();
        if (!clickedinCard){setDisplayMode('expanded')}
    }
    const minimizeCard = (e) =>{
        e.preventDefault();
        if (!clickedinCard){setDisplayMode('minimized')}
    }
    const maximizeCard = (e) =>{
        e.preventDefault();
        setClicked( (prevState) => !prevState);
        setDisplayMode( (prevState) =>  (prevState === 'maximized') ?  'expanded' : 'maximized')
    }

    let displayIcon = <IoChevronUp/>
    if(displayMode ==='expanded'){ displayIcon = <IoChevronDown/>}else{ displayIcon = <IoChevronUp/>}
    
        return (
            <div className={(displayMode === 'minimized') ? "card-default" : "card-" + displayMode} onMouseEnter={expandCard} onMouseLeave={minimizeCard} onClick={maximizeCard} >
                <div className="upper">
                <span className="timestamp">{props.timestamp}</span>{displayIcon}
                </div>
                <div className="lower">
                <span className={"content " +  displayMode}>
                    <ul>
                    {
                    props.content.map( (track, index) => 
                        <li key={track[4]} className={(displayMode ==='expanded' && index > 2) ? 'list-item-expanded': ''}>{track[3]} - {track[0]} by {track[1]}</li>
                    )
                    }
                </ul>
                     </span><br></br>
                </div>
            </div>
        )
   
}


export default Card