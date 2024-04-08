import React, { useState } from 'react'

const Input = ({ name, type, id, placeholder, value, icon,disable=false }) => {
    const [visible,setVisible]=useState(false)
  return (
    <div className="relative mb-4 w-[100%]">
      <input
        name={name}
        type={type=="password"? visible ? "text" : "password": type}
        id={id}
        placeholder={placeholder}
        defaultValue={value}
        className="input-box"
        disabled={disable}
      />{" "}
      <i className={"fa-regular " + icon + " input-icon"}></i>
          { type=="password"?
              <i className={"fa-regular fa-eye" + (!visible ? "-slash" : '') + " input-icon left-auto right-4 cursor-pointer"} onClick={() => setVisible(currentVal => !currentVal)}></i> : ''}
       
      </div>
      
  );
}

export default Input