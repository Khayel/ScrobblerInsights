import React, {useState,useEffect, useRef} from "react"
import {IoChevronForwardOutline,IoEllipse} from "react-icons/io5"


function Card(props){
    const [displayMode, setDisplayMode] = useState('minimized')

    const maximizeCard = (e) =>{
        e.preventDefault();
        if (props.cardType !== "cardYear"){
        setDisplayMode('maximized')
        }
        props.isClicked(props.timestamp,props.cardType)
    }

  let cardRef= useRef();
  useEffect( () => {
      let handler = (event)=> {
          if (!cardRef.current.contains(event.target)){
              setDisplayMode('minimized');
          }
      };
      document.addEventListener("mousedown",handler)
      return () =>{
          document.removeEventListener("mousedown", handler)
      }
  })
    let displayIcon = <IoChevronForwardOutline/>

    useEffect( ()=> {
        if (props.cardType === "cardYear"){
            setDisplayMode('maximized')
    
        }

    }, []);

    (displayMode ==='maximized') ?  displayIcon = <IoEllipse/> : displayIcon = <IoChevronForwardOutline/>;

        return (
            <div ref={cardRef} className={props.isSelected ? `card ${props.cardType} card-maximized `:`card ${props.cardType} card-${displayMode} `}  onClick={maximizeCard} >
                <div className="upper">
                <span className="timestamp">{props.timestamp}   </span><span>{displayIcon}</span>
                </div>
            </div>
        )
   
}


export default Card