import UserForm from "./UserForm";
import Card from "./Card";
import SortMenu from "./SortMenu";
import React, {useEffect, useState} from "react"
function Timeline() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [trackList, settracks] = useState([]);
  const [sortby, setSortby] = useState('year');
  const [sortedList, setSortedList] = useState({});
  
  useEffect( () => {setSortedList(organizeCards())}, [isLoaded]);
 // useEffect( () =>{ aggTrackList()},[sortby]);
  
  
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
           setSortedList(sortedObj);
           console.log(sortedList)
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
    fetch(`http://192.168.1.65:5001/user/khayelc`,
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
         setSortby('year')
        },
        (error) => {
          console.log(error)
          setIsLoaded(true);
          setError(error);
        })};
  
  function organizeCards(){
    console.log("organizing...")
    let sortedObj = {};
    trackList.forEach( (track) => {
      let dateVal = new Date(track[3]).toDateString().split(' ');
      let year = dateVal[3];
      let month = dateVal[1];
      let day = dateVal[2];


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


  const newCard =  <div className="Timeline">
  {(!isLoaded) ?
  <div className="usernameForm">
      <h1>type in your username to get started</h1>
      <UserForm onSubmit={getUserTracks}/>
  </div> :
    [<SortMenu setSort={ (selected) => {setSortby(selected)}}/>,
      <div className="timelineContainer">  
          <div className="trackList">
            {/* {
            Object.keys(sortedList).map( (year) => (
              <div className="year">
                <Card content={year}/>
                {Object.keys(sortedList[year]).map( (month) => (
                <div className="month">
                  <Card content={month}/>
                  {Object.keys(sortedList[year][month]).map( (day) => (
                    <div className="day">
                    <Card content={day}/>
                    <ul>
                    {Object.entries(sortedList[year][month][day]).map( (track) => (
                      track
                      ))}
                    </ul>
                    </div>
                  ))}
                  </div>
                ))}
                </div>
            ))} */}


            {/* NESTED CARD ELEMENTS */}
              {
            Object.keys(sortedList).map( (year) => (
              <div className="year">
                <Card timestamp={year} content=
                {Object.keys(sortedList[year]).map( (month) => (
                <div className="month">
                  <Card timestamp={month} content=
                  {Object.keys(sortedList[year][month]).map( (day) => (
                    <div className="day">
                    <Card timestamp={day} content={
                    (<ul>
                      
                    {Object.entries(sortedList[year][month][day]).map( (track) => (
                      <li>{track}</li>
                      ))}
                     
                    </ul>)}/>
                    </div>
                  ))}/>
                  </div>
                ))}/>
                </div>
            ))}
          
            {/* {(isLoaded) ?
              // Object.entries(sortedList).map( ([timeVal,track]) => (<Card className="card" displayMode={sortby} key={track[4]}  timestamp={timeVal} content={track}/> )):
               sortedList.map( (item) => (<Card className="card" content={item}/>))
               :
               <div></div>
    } */}
  {(error) ? <div>Error: {error.message}</div>: <div></div> }
    </div>
  </div>
  ]
}
</div>;





return (newCard
  //   <div className="Timeline">
    
  //       {(!isLoaded) ?
  //       <div className="usernameForm">
  //           <h1>type in your username to get started</h1>
  //           <UserForm onSubmit={getUserTracks}/>
  //       </div> :
  //         [<SortMenu setSort={ (selected) => {setSortby(selected)}}/>,
  //           <div className="timelineContainer">  
  //               <div className="trackList">
  //                 {(isLoaded) ?
  //                   Object.entries(sortedList).map( ([timeVal,track]) => (<Card className="card" displayMode={sortby} key={track[4]}  timestamp={timeVal} content={track}/> )):
  //                    <div></div>
  //         }
  //       {(error) ? <div>Error: {error.message}</div>: <div></div> }
  //         </div>
  //       </div>
  //       ]
  //     }
  // </div>
  );
}
export default Timeline;
