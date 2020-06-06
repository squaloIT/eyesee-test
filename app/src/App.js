import React from 'react';

// DIFFICULTY
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
// DIFFICULTY

//BUTTON
import Button from '@material-ui/core/Button';
//BUTTON

//GRID
import Grid from '@material-ui/core/Grid';
//GRID

import { ALFABET_KEY_VALUE_PAIRS } from './const/alfabet';
import './App.css';

/*
  Because of faster re-rendering I hoisted radio button at the top.
*/
const radioButton = <Radio color="primary" />;

function App() {
  return (
    <div className="App">
      <div className="block">
        <div className="block__difficulty">
          <FormControl component="fieldset">
            <FormLabel component="legend" className="block__difficulty__label--big-font-label">Choose Difficulty</FormLabel>
            <RadioGroup row aria-label="position" name="difficulty" defaultValue="easy">
              <FormControlLabel
                value="easy"
                control={radioButton}
                label="Easy"
              />
              <FormControlLabel
                value="medium"
                control={radioButton}
                label="Medium"
              />
              <FormControlLabel
                value="hard"
                control={radioButton}
                label="Hard"
              />
            </RadioGroup>
          </FormControl>
        </div>

        <Button variant="outlined" color="primary">Start game</Button>

        <div className='block__game block__game--display-true'>
          <div className='block__game__random-number'>
            <h2>17</h2>
          </div>

          <div className="block__game grid__abeceda">
            <Grid container spacing={0}>
              {ALFABET_KEY_VALUE_PAIRS.map(alf => {
                return (<Grid item xs={2} className="grid__abeceda__row--mt-10" key={alf.letter}>
                  <p className='paper--font-big paper--color-gray'>{alf.letter} ({alf.value})</p>
                </Grid>)
              })}
            </Grid>
          </div>
        </div>


      </div>
    </div>
  );
}

export default App;
