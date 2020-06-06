import React from 'react';
import './Countdown.css';

const Countdown = ({ isCountdownVisible, counter }) => {
  return (
    <div className={`block__countdown block__countdown--background-black 
    ${isCountdownVisible ? "block__countdown--display-true" : "block__countdown--display-false"}`
    }

    >
      <h1>GET READY IN ...</h1>
      <h1>{counter} {counter ? '' : '!'}</h1>
    </div>
  )
}

export default Countdown;