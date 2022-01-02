import React, {useState,useEffect, useRef} from "react"
import {IoChevronDown, IoChevronUp} from "react-icons/io5"


function Card(props){
    const [displayMode, setDisplayMode] = useState('minimized')

    const maximizeCard = (e) =>{
        e.preventDefault();
        if (props.cardType !== "cardYear"){
        setDisplayMode('maximized')
        }
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
    let displayIcon = <IoChevronUp/>
   

    useEffect( ()=> {
        if (props.cardType === "cardYear"){
            setDisplayMode('maximized')
    
        }

    }, [])
    if(displayMode ==='maximized'){ displayIcon = <IoChevronDown/>}else{ displayIcon = <IoChevronUp/>}
    
        return (
            <div ref={cardRef} className={`card ${props.cardType} card-${displayMode} `}  onClick={maximizeCard} >
                <div className="upper">
                <span className="timestamp">{props.timestamp}</span>{displayIcon}
                </div>
                <div className="lower">
                <div className={`content ${displayMode}`}>
                    {props.content}
                     </div><br></br>
                </div>
            </div>
        )
   
}


export default Card