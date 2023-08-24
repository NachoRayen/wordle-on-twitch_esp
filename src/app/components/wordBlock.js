import { useState, useEffect } from 'react';
import styles from './WordBlock.module.scss'
import WordLetter from './wordLetter';

function WordBlock(props) {
  const { word, answer, updateLetterStatus } = props;
  const [getStatusArray, setStatusArray] = useState(Array(word.length).fill(0));
  const answerLetterArray = answer.split('');
  const wordLetterArray = word.split('');

  const initStatusArray = () => {
    let tempArray = Array(word.length).fill(0);
    let answerCheckArray = [...answerLetterArray];

    //Loop through the letters and check their status
    for (let i = 0; i < wordLetterArray.length; i++) {
      // Correct if correct letter is in correct space
      if (wordLetterArray[i] === answerCheckArray[i]) {
        tempArray[i] = 2;
        answerCheckArray[i] = '-'; //Prevent further checks from counting this found letter
      }
      else {
        let letterFound = false;
        //Check other letters in answer
        for (let j = 0; j < answerCheckArray.length && !letterFound; j++) {
          if (wordLetterArray[i] === answerCheckArray[j]) {
            tempArray[i] = 1;
            answerCheckArray[j] = '-';
            letterFound = true;
          }
        }
      }

    }
    setStatusArray([...tempArray]);

    //send letter data to game component to update keybaord
    let tempObject = {};
    for (let i = 0; i < wordLetterArray.length; i++) {
      if (!tempObject[wordLetterArray[i]] || tempObject[wordLetterArray[i]] < tempArray[i]) {
        tempObject[wordLetterArray[i]] = tempArray[i];
      }
    }
    updateLetterStatus(tempObject);
  }

  useEffect(() => {
    initStatusArray();
  }, []);

  return (
    <div className={styles.block}>
      {wordLetterArray.map((letter, index) => (
        <WordLetter key={index} letter={letter} status={getStatusArray[index]} />
      ))}
    </div>
  );
}

export default WordBlock;
