import React, {useState, useEffect} from "react";
import {IoLogoGithub,IoTime,IoStatsChartSharp} from "react-icons/io5"

function Navbar(props){
    const [scrollPosition, setSrollPosition] = useState(0);
    const [navbarStyle, setNavBarStyle] = useState("navbar")
    const handleScroll = () => {
    const position = window.pageYOffset;
    setSrollPosition(position);
    if (scrollPosition > 1){
        setNavBarStyle("navbar-minimized")
        
    }
    if (scrollPosition === 1){
        setNavBarStyle("navbar")
        
    }
    console.log(scrollPosition)
};
    
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return(
    <nav className= {navbarStyle}>
        <div className="left-items">
            <div onClick={()=>{props.changeMode('timeline')}}><IoTime/></div>
            <div onClick={()=>{props.changeMode('insights')}}><IoStatsChartSharp/></div>
        </div>
        <div>Listener Insights</div>
        <div className="right-items">
              <div>About</div>
            <div><IoLogoGithub/></div>
        </div>

      
    </nav>
    )
}
export default Navbar