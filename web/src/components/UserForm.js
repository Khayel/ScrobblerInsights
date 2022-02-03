import React, { useEffect, useState } from "react"

function UserForm(props) {
    const [username, setUsername] = useState('');
  
    const onSubmit = (e) =>{
    e.preventDefault();
    props.getUsername(username)
    }
    
      return (
        <form className="username-form" onSubmit = {onSubmit}>
<input type="text"placeholder="Enter your username to get started." className="username-input" onChange={event => setUsername(event.target.value)}></input>
        </form>
      )
}
export default UserForm