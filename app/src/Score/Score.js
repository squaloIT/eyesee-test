import React from 'react';
import './Score.css';

const Score = ({ score }) => {
  return (
    <div className='block__score'>
      <h4 className="paper--color-gray">YOUR SCORE</h4>
      <h4 className="paper--color-hit">HIT: {score.hit}</h4>
      <h4 className="paper--color-miss">MISS: {score.miss}</h4>
      <h4 className="paper--color-purple">LEFT: {score.left}</h4>
    </div>
  )
}

export default Score;