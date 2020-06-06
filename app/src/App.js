import React, { useState, useEffect, useCallback } from 'react';
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

import { ALFABET_KEY_VALUE_PAIRS } from './const/alfabet';
import LetterGrid from './LetterGrid/LetterGrid';
import Score from './Score/Score';
import Countdown from './Countdown/Countdown';

import './App.css';

/*
  Because of faster re-rendering I hoisted radio button at the top.
*/
const radioButton = <Radio color="primary" />;
const defaultScore = {
  hit: 0,
  miss: 0,
  left: ALFABET_KEY_VALUE_PAIRS.length
};

function App() {
  const [isCountdownVisible, setCountdownVisibility] = useState(false);
  const [isInGame, setIsInGame] = useState(false);
  const [counter, setCounter] = useState(5);
  const [prevRandomNumbers, setPrevRandomNumbers] = useState([]);
  const [alfabetForDisplay, setAlfabetForDisplay] = useState(
    ALFABET_KEY_VALUE_PAIRS.map(alf => ({
      ...alf,
      score: 'left'
    }))
  );
  const [score, setScore] = useState(defaultScore);

  const [isKeyPressedInThisIteration, setKeyPressedInThisIteration] = useState(false);
  var gameLoopInterval;

  const handleStartGame = () => {
    setIsInGame(true)
    setAllLettersToGray()
    setCountdownVisibility(true);
    setScore(defaultScore);
  };

  const handleStopGame = () => {
    setIsInGame(false);
    clearInterval(gameLoopInterval);
    setPrevRandomNumbers([]);
  };

  const defineScore = useCallback((type) => {
    if (type == 'miss') {
      setScore((prevScore) => {
        return {
          ...prevScore,
          miss: prevScore.miss + 1,
        }
      })
    }

    if (type == 'hit') {
      setScore((prevScore) => {
        return {
          ...prevScore,
          hit: prevScore.hit + 1,
        }
      })
    }
    if (type == 'left') {
      setScore((prevScore) => {
        return {
          ...prevScore,
          left: prevScore.left - 1,
        }
      })
    }
  }, []);

  const handleKeyPress = (evt) => {
    if (isInGame && !isKeyPressedInThisIteration && prevRandomNumbers.length > 0) {
      const keyPressed = evt.key;
      const valueOfKeyPressed = alfabetForDisplay.find(el => el.letter.toLowerCase() == keyPressed.toLowerCase()) ? alfabetForDisplay.find(el => el.letter.toLowerCase() == keyPressed.toLowerCase()).value : '';

      if (valueOfKeyPressed == prevRandomNumbers[prevRandomNumbers.length - 1]) {
        defineScore('hit');
        defineScore('left');
        setColorTypeForLetterValue(prevRandomNumbers[prevRandomNumbers.length - 1], 'hit');
      } else {
        defineScore('miss')
        defineScore('left')
        setColorTypeForLetterValue(prevRandomNumbers[prevRandomNumbers.length - 1], 'miss');
      }

      setKeyPressedInThisIteration(true);
    }
  };

  const setAllLettersToGray = () => {
    alfabetForDisplay.forEach(el => {
      setColorTypeForLetterValue(el.value, 'left')
    })
  };

  const gameIteration = () => {
    if (prevRandomNumbers.length == alfabetForDisplay.length) {
      if (alfabetForDisplay
        .find(alf => prevRandomNumbers[prevRandomNumbers.length - 1] == alf.value)
        .score == 'left') {
        defineScore('miss')
        defineScore('left')
        setColorTypeForLetterValue(prevRandomNumbers[prevRandomNumbers.length - 1], 'miss')
      }
      handleStopGame();
      return;
    }

    if (
      !isKeyPressedInThisIteration &&
      prevRandomNumbers.length > 0
      &&
      alfabetForDisplay
        .find(alf => prevRandomNumbers[prevRandomNumbers.length - 1] == alf.value)
        .score == 'left'
    ) {
      defineScore('miss')
      defineScore('left')
      setColorTypeForLetterValue(prevRandomNumbers[prevRandomNumbers.length - 1], 'miss')
    }

    setKeyPressedInThisIteration(false);
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

    setPrevRandomNumbers(prevValue => {
      return [...prevValue, rand]
    })
  }

  const setColorTypeForLetterValue = useCallback((value, type) => {
    setAlfabetForDisplay((prevAlf) => {
      return prevAlf.map(el =>
        el.value == value ? ({
          ...el,
          score: prevRandomNumbers.length == alfabetForDisplay.length ? el.type : type
        })
          : el
      )
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    var countDownInterval;

    if (isCountdownVisible) {
      countDownInterval = setInterval(() => {
        setCounter((prevState) => {
          if (prevState == 0) {
            setCountdownVisibility(false)
            setIsInGame(true)
          }

          return prevState - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(countDownInterval)
      setCounter(5)
    }
  }, [isCountdownVisible])

  useEffect(() => {
    if (isInGame && !isCountdownVisible) {
      const selectedDifficulty = Array.from(document.getElementsByName('difficulty')).find(el => el.checked).value;
      const timeLoop = selectedDifficulty * 1000;

      gameLoopInterval = setInterval(() => {
        gameIteration();
      }, timeLoop);
    }
    return () => clearInterval(gameLoopInterval);
  }, [isInGame, isCountdownVisible, prevRandomNumbers, alfabetForDisplay]);

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

            <RadioGroup row aria-label="position" name="difficulty" defaultValue="1.5">
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
                value="1.5"
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

          <LetterGrid alfabetForDisplay={alfabetForDisplay} />
        </div>
      </div>

      <Countdown isCountdownVisible={isCountdownVisible} counter={counter} />

      <Score score={score} />
    </div>
  );
}

export default App;
