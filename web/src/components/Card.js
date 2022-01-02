import React, {useState,useEffect} from "react"
import {IoChevronDown, IoChevronUp} from "react-icons/io5"

function Card(props){
    const [displayMode, setDisplayMode] = useState('minimized')
    const [clickedinCard, setClicked] = useState(false)


    const expandCard = (e)=>{
        e.preventDefault();
        if (props.cardType !== "cardYear"){
        if (!clickedinCard){setDisplayMode('expanded')}
    }}
    const minimizeCard = (e) =>{
        e.preventDefault();
        if (props.cardType !== "cardYear"){
        if (!clickedinCard){setDisplayMode('minimized')}
    }}
    const maximizeCard = (e) =>{
        e.preventDefault();
        setClicked( (prevState) => !prevState);
        setDisplayMode( (prevState) =>  (prevState === 'maximized') ?  'expanded' : 'maximized')
    }


    let displayIcon = <IoChevronUp/>

    useEffect( ()=> {
        if (props.cardType === "cardYear"){
            setDisplayMode('expanded')
        }
    }, [])
    if(displayMode ==='expanded'){ displayIcon = <IoChevronDown/>}else{ displayIcon = <IoChevronUp/>}
    
        return (
            <div className={(displayMode === 'minimized') ? `card card-default ${props.cardType}`  : `card card-${displayMode} ${props.cardType}`} onMouseEnter={expandCard} onMouseLeave={minimizeCard} onClick={maximizeCard} >
                <div className="upper">
                <span className="timestamp">{props.timestamp}</span>{displayIcon}
                </div>
                <div className="lower">
                <span className={`content ${displayMode}`}>
                    {props.content}
                     </span><br></br>
                </div>
            </div>
        )
   
}


export default Card