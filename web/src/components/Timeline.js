import UserForm from "./UserForm";
import Card from "./Card";
import SortMenu from "./SortMenu";
import React, {useEffect, useState} from "react"
import TrackList from "./TrackList";

function Timeline({setUserId}) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [trackList, settracks] = useState([]);
  const [sortedList, setSortedList] = useState({});
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [isfinishedSort, setFinishedSort] = useState(false)
  
  useEffect( () => {setSortedList(organizeCards())}, [isLoaded]);
  
  useEffect(()=>{
    setError(null)
      fetch(`http://192.168.1.72:5001/user/khayelc`,
      { headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }})
        .then(res => res.json())
        .then(
          (result) => {
            setUserId(result['user_id'])
            settracks(result['tracks_played']);
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
    setFinishedSort(true)
    return sortedObj;
}

function updateSelectedDate(newDate,type){
   switch(type){
    case 'year':
      setSelectedYear(newDate);
      break;
      case 'month':
        setSelectedMonth(newDate);
        break;
      case 'day':
          setSelectedDay(newDate);
          break;
  }
}
  
function getTracks(){
  return sortedList[selectedYear][selectedMonth][selectedDay]
}
return (
  <div className="Timeline">
  {(!isLoaded) && (isfinishedSort) ?
  <div className="usernameForm">
    <div class="lds-facebook"><div></div><div></div><div></div></div>
  </div> :
   
      <div className="timelineContainer">  
            <div className="yearColumn">
                {Object.keys(sortedList).map( (year) =>(
                  <Card key={year} cardType='year' isSelected={year === selectedYear ? 'true': ''} timestamp={year} isClicked={updateSelectedDate}/>
                ))}
            </div>

            <div className="monthColumn">
              {sortedList[selectedYear] && Object.keys(sortedList[selectedYear]).map( (month) => (
                <Card key={month} cardType='month' isSelected={month === selectedMonth ? true : false}  timestamp={month} isClicked={updateSelectedDate}/>
              ))}
            </div>

              <div className="dayColumn">
                {(sortedList[selectedYear] && sortedList[selectedYear][selectedMonth]) && Object.keys(sortedList[selectedYear][selectedMonth]).map( (day) => (
                <Card key={day} cardType='day' timestamp={day} isClicked={updateSelectedDate}/>
              ))}
            </div>   
            <div className="songList">
              {(sortedList[selectedYear] && sortedList[selectedYear][selectedMonth] && sortedList[selectedYear][selectedMonth][selectedDay]) &&
              <TrackList key={Math.random()} tracks={getTracks()}/>
  }
            </div> 
                
  {(error) ? <div>Error: {error.message}</div>: <div></div> }
    </div>
  }
</div>
  );
}
export default Timeline;


