import React, {useState} from "react";

function SortMenu(props){
    
    const [clicked, setClicked] = useState('day')

    const choice = (value) =>{
        props.setSort(value);
        setClicked(value);
        }

    return(
    <nav className="sortmenu">
        <div className={` ${(clicked === 'day') ? 'choice-selected': '' } choice`} onClick={() => {choice("day");}}>Day</div>
        <div className={`${(clicked === 'month') ? 'choice-selected': ''} choice`} onClick={() => {choice("month")}}>Month</div>
        <div className={`${(clicked === 'year') ? 'choice-selected': ''} choice`} onClick={() => {choice("year")}}>Year</div>
    </nav>
    )
}
export default SortMenu