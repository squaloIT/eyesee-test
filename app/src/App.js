import React, { useState, useEffect } from 'react';

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
const defaultScore = {
  hit: 0,
  miss: 0,
  left: 26
};

function App() {
  const [isCountdownVisible, setCountdownVisibility] = useState(false);
  const [isInGame, setIsInGame] = useState(false);
  const [counter, setCounter] = useState(5);
  const [alfabetForDisplay, setAlfabetForDisplay] = useState(
    ALFABET_KEY_VALUE_PAIRS.map(alf => ({
      ...alf,
      score: 'left'
    }))
  )
  // const [alfabetOptions, setAlfabetOptions] = useState([...ALFABET_KEY_VALUE_PAIRS]);
  const [score, setScore] = useState(defaultScore);

  var isKeyPressedInThisIteration = false;
  var prevRandomNumbers = [];
  var gameLoopInterval;

  const handleStartGame = () => {

    //TMP
    setIsInGame(true)
    setAllLettersToGray()
    // gameLoop()


    // setCountdownVisibility(true);
    // const interval = setInterval(() => {
    //   setCounter((prevState) => {
    //     if (prevState == 0) {
    //       clearInterval(interval);
    //       setCountdownVisibility(false)
    //       setIsInGame(true)
    //       gameLoop()
    //     }

    //     return prevState - 1;
    //   });
    // }, 1000);
  };

  const handleStopGame = () => {
    setIsInGame(false);
    clearInterval(gameLoopInterval);
    document.removeEventListener("keypress", handleKeyPress);
    prevRandomNumbers = [];
  };

  const handleKeyPress = (evt) => {
    if (isKeyPressedInThisIteration)
      return;

    const keyPressed = evt.key;
    const valueOfKeyPressed = alfabetForDisplay.find(el => el.letter.toLowerCase() == keyPressed.toLowerCase()).value;
    //promeniti skor itd
    console.log(`valueOfKeyPressed`)
    console.log(valueOfKeyPressed)

    console.log(`keyPressed`)
    console.log(keyPressed)

    if (valueOfKeyPressed == prevRandomNumbers[prevRandomNumbers.length - 1]) {
      setScore((prevScore) => {
        return {
          ...prevScore,
          hit: prevScore.hit + 1,
          left: prevScore.left - 1
        }
      })
    } else {
      setScore((prevScore) => {
        return {
          ...prevScore,
          miss: prevScore.miss + 1,
          left: prevScore.left - 1
        }
      })

      setColorTypeForLetterValue(valueOfKeyPressed, 'miss');
      console.log(alfabetForDisplay)
    }

    console.log(`{score}`);
    console.log(score);

    //!TODO promeniti boju elementu sa tom vrednoscu
    isKeyPressedInThisIteration = true;
  };

  const setAllLettersToGray = () => {
    alfabetForDisplay.forEach(el => {
      setColorTypeForLetterValue(el.value, 'left')
    })
  };

  const setColorTypeForLetterValue = (value, type) => {
    setAlfabetForDisplay((prevAlf) => {
      return prevAlf.map(el =>
        el.value == value ? ({
          ...el,
          score: type
        })
          : el
      )
    });
  }

  useEffect(() => {
    if (isInGame) {
      setScore(defaultScore);
      const selectedDifficulty = Array.from(document.getElementsByName('difficulty')).find(el => el.checked).value;
      const timeLoop = selectedDifficulty * 1000;

      document.addEventListener("keypress", handleKeyPress);

      gameLoopInterval = setInterval(() => {
        if (prevRandomNumbers.length == alfabetForDisplay.length) {

          setColorTypeForLetterValue(prevRandomNumbers[prevRandomNumbers.length - 1], 'miss')
          handleStopGame();
          return;
        }

        if (!isKeyPressedInThisIteration) {
          setScore((prevScore) => {
            return {
              ...prevScore,
              miss: prevScore.miss + 1,
              left: prevScore.left - 1
            }
          })

          setAlfabetForDisplay((prevAlf) => {
            return prevAlf.map(el =>
              el.value == prevRandomNumbers[prevRandomNumbers.length - 1] ? ({
                ...el,
                score: 'miss'
              })
                : el
            )
          });
        }

        isKeyPressedInThisIteration = false;
        var rand = Math.floor(Math.random() * (alfabetForDisplay.length - 1 + 1)) + 1;

        if (prevRandomNumbers.find(num => num == rand)) {
          while (isInGame && prevRandomNumbers.find(num => num == rand)) {
            if (prevRandomNumbers.length == alfabetForDisplay.length) { //no one wants stackoverflow :)
              handleStopGame();
              break;
            }
            rand = Math.floor(Math.random() * (alfabetForDisplay.length - 1 + 1)) + 1;
          }
        }

        prevRandomNumbers.push(rand);
        console.log(prevRandomNumbers)
      }, timeLoop);
    }
    return () => clearInterval(gameLoopInterval);
  }, [isInGame]);


  return (
    <div className="App">
      <div className="block">
        <div className="block__difficulty">
          <FormControl component="fieldset">
            <FormLabel component="legend" className={
              `block__difficulty__label--big-font-label
              ${isInGame ? 'paper--color-gray' : ''}`
            }>
              Choose Difficulty
            </FormLabel>

            <RadioGroup row aria-label="position" name="difficulty" defaultValue="0.2">
              <FormControlLabel
                value="5"
                control={radioButton}
                label="Easy"
                disabled={isInGame}
              />
              <FormControlLabel
                value="3.5"
                control={radioButton}
                label="Medium"
                disabled={isInGame}
              />
              <FormControlLabel
                value="0.2"
                control={radioButton}
                label="Hard"
                disabled={isInGame}
              />
            </RadioGroup>
          </FormControl>
        </div>

        <Button variant="outlined" color="primary" onClick={
          isInGame ? () => handleStopGame() : () => handleStartGame()
        }>
          {isInGame ? 'Stop game' : 'Start game'}
        </Button>

        <div className='block__game'>
          <div className={
            `block__game__random-number 
            ${isInGame ? 'block__game__random-number--display-true' : 'block__game__random-number--display-false'}`
          }>
            <h2>{prevRandomNumbers[prevRandomNumbers.length - 1]}</h2>
          </div>

          <div className="block__game grid__abeceda">
            <Grid container spacing={0}>
              {
                alfabetForDisplay.map(alf => {
                  return (<Grid item xs={2} className="grid__abeceda__row--mt-10" key={alf.letter}>
                    <p className={`paper--font-big paper--color-${alf.score}`}>{alf.letter} ({alf.value})</p>
                  </Grid>)
                })
              }
            </Grid>
          </div>
        </div>
      </div>

      <div className={`block__countdown block__countdown--background-black 
        ${isCountdownVisible ? "block__countdown--display-true" : "block__countdown--display-false"}`
      }

      >
        <h1>GET READY IN ...</h1>
        <h1>{counter} {counter ? '' : '!'}</h1>
      </div>

      <div className='block__score'>
        <h4 className="paper--color-gray">YOUR SCORE</h4>
        <h4 className="paper--color-hit">HIT: {score.hit}</h4>
        <h4 className="paper--color-miss">MISS: {score.miss}</h4>
        <h4 className="paper--color-purple">LEFT: {score.left}</h4>
      </div>
    </div>
  );
}

export default App;
