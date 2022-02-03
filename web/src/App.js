
import './assets/App.css';
import React, {useState} from "react"
import Navbar from "./components/Navigation";
import Timeline from './components/Timeline';
import Insights from './components/Insights';

function App() {
  const [mode,setMode] =  useState('timeline')
  const [user, setUser] = useState(0)
 
  return (
    <div className="App">
      <Navbar changeMode={ (mode) => (setMode(mode)) }/>      
      {(mode ==='timeline' ) ? 
       <Timeline  setUserId={ (user_id) => {setUser(user_id) }}/> : <Insights user_id={user}/>}
    </div>
    );
}
export default App;
