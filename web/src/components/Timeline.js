import UserForm from "./UserForm";
import Card from "./Card";
import SortMenu from "./SortMenu";
import React, {useEffect, useState} from "react"
function Timeline() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [trackList, settracks] = useState([]);
  const [sortby, setSortby] = useState('');
  const [sortedList, setSortedList] = useState([]);
  
  useEffect( () =>{ aggTrackList()},[sortby]);
  
  
  const aggTrackList = () => {
    console.log("sortby changed" + isLoaded)
    //TODO define method to isolate unique days/months/years
    //TODO for day
    //  { "dayValue": [ [0:00am, Let it be, The Beatles],[23:00, Song,Artist]
    //  {}
    setSortedList([])
    let sortedObj = {};
    switch(sortby){
      case 'day':
        trackList.forEach( (track) => {
           let dayVal = new Date(track[3]).toDateString();
           (dayVal in sortedObj) ? sortedObj[dayVal].push(track) : sortedObj[dayVal] = [track];
    
            }
           )
           setSortedList(sortedObj)
           break;
        //   //isolate appropriate date string in this case day and create a list of tracks...
          
        //sort tracklist by day
      case 'week':
        //sort tracklist by month
      case 'month':
        trackList.forEach( (track) => {
          let monthVal = new Date(track[3]).toDateString().split(' ');
          let monthYear = monthVal[1] + monthVal[3];
          (monthYear in sortedObj) ? sortedObj[monthYear].push(track) : sortedObj[monthYear] = [track];
          
        });
        
        setSortedList(sortedObj)
        break;
        //sort...
      case 'year':
        trackList.forEach( (track) => {
          let yearVal = new Date(track[3]).toDateString().split(' ');
          let year = yearVal[3];
          (year in sortedObj) ? sortedObj[year].push(track) : sortedObj[year] = [track];
          
        })
        setSortedList(sortedObj)
        break;
        //sort
    }
    console.log("finishyed sorted" + isLoaded)
  }

  const getUserTracks = (username)=>{
    setError(null)
    fetch(`http://192.168.1.72:5000/user/${username}`,
    { headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     }})
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
          console.log(result['tracks_played'])
          settracks(result['tracks_played']);
          aggTrackList();
         setIsLoaded(true);
         setSortby('day')
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error)
          setIsLoaded(true);
          setError(error);
        })};
  return (
    <div className="Timeline">
    <h1> Your timeline</h1>
        {(!isLoaded) ? <UserForm onSubmit={getUserTracks}/> :
          <SortMenu setSort={ (selected) => {setSortby(selected)}}/>
          }

      <div className="trackList">
        {(isLoaded) ?  Object.entries(sortedList).map( ([timeVal,track]) => (<Card className="card" displayMode={sortby} key={track[4]}  timestamp={timeVal} content={track}/> )): <div></div>
        }
      {(error) ? <div>Error: {error.message}</div>: <div></div> }

      </div>
  </div>);
}
export default Timeline;
