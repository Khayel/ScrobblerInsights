

import React, {useState} from "react"
import Songcloud from "./Songcloud";
function Insights({user_id}) {

 
  return (
    <div className="Insights">
        <Songcloud user_id={user_id}/>
   
    </div>
    );
}
export default Insights;