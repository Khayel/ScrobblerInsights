import UserForm from "./UserForm";
import Card from "./Card";
import SortMenu from "./SortMenu";
import React, {useEffect, useState} from "react"
import TrackList from "./TrackList";

function Timeline() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [trackList, settracks] = useState([]);
  const [sortby, setSortby] = useState('year');
  const [sortedList, setSortedList] = useState({});
  
  useEffect( () => {setSortedList(organizeCards())}, [isLoaded]);
 // useEffect( () =>{ aggTrackList()},[sortby]);
  
  
  // const aggTrackList = () => {
  //   console.log("sortby changed" + isLoaded)
  //   setSortedList([])
  //   let sortedObj = {};
  //   switch(sortby){
  //     case 'day':
  //       trackList.forEach( (track) => {
  //          let dayVal = new Date(track[3]).toDateString();
  //          (dayVal in sortedObj) ? sortedObj[dayVal].push(track) : sortedObj[dayVal] = [track];
    
  //           }
  //          )
  //          setSortedList(sortedObj);
  //          console.log(sortedList)
  //          break;
  //       //   //isolate appropriate date string in this case day and create a list of tracks...
          
  //       //sort tracklist by day
  //     case 'week':
  //       //sort tracklist by month
  //     case 'month':
  //       trackList.forEach( (track) => {
  //         let monthVal = new Date(track[3]).toDateString().split(' ');
  //         let monthYear = monthVal[1] + monthVal[3];
  //         (monthYear in sortedObj) ? sortedObj[monthYear].push(track) : sortedObj[monthYear] = [track];
          
  //       });
        
  //       setSortedList(sortedObj)
  //       break;
  //       //sort...
  //     case 'year':
  //       trackList.forEach( (track) => {
  //         let yearVal = new Date(track[3]).toDateString().split(' ');
  //         let year = yearVal[3];
  //         (year in sortedObj) ? sortedObj[year].push(track) : sortedObj[year] = [track];
          
  //       })
  //       setSortedList(sortedObj)
  //       break;
  //       //sort
  //   }
  //   console.log("finishyed sorted" + isLoaded)
  // }

  
  useEffect(()=>{
    setError(null)
      fetch(`http://192.168.1.72:5000/user/khayelc`,
      { headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }})
        .then(res => res.json())
        .then(
          (result) => {
            settracks(result['tracks_played']);
            // aggTrackList();
           setIsLoaded(true);
           console.log(trackList)
            
          },
          (error) => {
            console.log(error)
            setIsLoaded(true);
            setError(error);
          })},[]);
  

  function organizeCards(){
    console.log("organizing...")
    let sortedObj = {};
    let templist = [];
    trackList.forEach( (track) => {
      let dateVal = new Date(track['date']).toDateString().split(' ');
      let year = parseInt(dateVal[3]);
      let month = dateVal[1];
      let day = parseInt(dateVal[2]);


      if (!(year in sortedObj)){
        sortedObj[year] = {}
      }
      if (!(month in sortedObj[year])){
        sortedObj[year][month] = {}
      }
      if (!(day in sortedObj[year][month])){
        sortedObj[year][month][day] = []
      }
    sortedObj[year][month][day].push(track);

    
  })
  
    console.log(sortedObj);
    return sortedObj;
}

return (
  <div className="Timeline">
  {(!isLoaded) ?
  <div className="usernameForm">
    <div class="lds-facebook"><div></div><div></div><div></div></div>
  </div> :
   
      <div className="timelineContainer">  
          <div className="trackList">
              {
            Object.keys(sortedList).map( (year) => (
              <>
                <Card key={Math.random()} timestamp={year} cardType="cardYear" content=
                {Object.keys(sortedList[year]).map( (month) => (
                <>
                  <Card key={Math.random()} timestamp={month} cardType="cardMonth" content=
                  {Object.keys(sortedList[year][month]).map( (day) => (
                    <>
                    <Card key={Math.random()} timestamp={day} cardType="cardDay" content={
                    (
                      <TrackList tracks={sortedList[year][month][day]}/>
                     
                    )}/>
                    </>
                  ))}/>
                  </>
                ))}/>
                </>
            ))}
  {(error) ? <div>Error: {error.message}</div>: <div></div> }
    </div>
  </div>
  
}
</div>
  );
}
export default Timeline;



const obj = {
  "2021": {
    "Dec": {
        "10": [1,2,3],
        "11": [4,5,6]
           },
     "Nov": {
        "10": [1,2,3],
        "11": [4,5,6]
           }
        }
}
