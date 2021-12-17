
import './assets/App.css';
import React, {useState} from "react"
import Navbar from "./components/Navigation";
import Timeline from './components/Timeline';
import Insights from './components/Insights';

function App() {
  const [mode,setMode] =  useState("timeline")
 
  return (
    <div className="App">
      <Navbar changeMode={ (mode) => (setMode(mode)) }/>
      {(mode === 'timeline') ? <Timeline/> : <Insights/>}
    </div>
    );
}
export default App;
