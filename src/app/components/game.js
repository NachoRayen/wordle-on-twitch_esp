'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './Game.module.scss';
import Scoreboard from './scoreboard';
import Keyboard from './keyboard';
import BigLetters from './bigLetters';
import WordBlock from './wordBlock';
import EntryField from './entryField';
import answerList from '../solutionwords.json';
import wordList from '../words.json';

export default function Game(props) {
  const { client } = props;
  const [getAnswer, setAnswer] = useState("");
  const [getChatMessages, setChatMessages] = useState([]);
  const [getGuessArray, setGuessArray] = useState([]);
  const [getChatArray, setChatArray] = useState([]);
  const [getAnswerStatus, setAnswerStatus] = useState([]);
  const [getLetterStatus, setLetterStatus] = useState({});
  const [getTimeoutStatus, setTimeoutStatus] = useState({});
  const [getUserScores, setUserScores] = useState({});
  const [isWordFound, setIsWordFound] = useState(false);
  const prevDependencyRef = useRef();
  const wordLength = 5;
  const timeoutLength = 3000;

  client.on('message', (channel, tags, message, self) => {
    addChatMessage(message, tags['display-name'], tags['color']);
  });

  const timeoutUser = (user) => {
    setTimeoutStatus(prevObject => ({
      ...prevObject,
      [user]: true,
    }));
    // console.log('Timed out ' + user);
    setTimeout(function () {
      setTimeoutStatus(prevObject => ({
        ...prevObject,
        [user]: false,
      }));
      // console.log('Untimed out ' + user);
    }, timeoutLength);
  }


  // Reset the object keeping track of the answer status to all false
  const initializeAnswerStatus = () => {
    const tempAnswerStatus = [];
    for (let i = 0; i < wordLength; i++) {
      tempAnswerStatus.push(false);
    }
    setAnswerStatus(tempAnswerStatus);
  }
  
  // Reset the object keeping track of the letter status to all -1
  const initializeLetterStatus = () => {
    const qwertyAlphabet = "qwertyuiopasdfghjklzxcvbnm";
    const tempLetterStatus = {};

    for (let i = 0; i < qwertyAlphabet.length; i++) {
      tempLetterStatus[qwertyAlphabet[i]] = -1;
    }

    setLetterStatus(tempLetterStatus);
  }

  // Update the object keeping track of the status of each letter in the answer.
  // Used to update the big letter visual.
  // The "statusFromGuess" parameter is passed each time a word is added to the guess list, 
  // and this function updates the corresponding getAnswerStatus entry to true if a letter was newly found in a correct spot.
  // It never changes it back to false because you cannot "unfind" a letter. (initializeAnswerStatus is used to reset after the word is found)
  // false = letter not yet found (default state)
  // true = letter in correct place
  const updateAnswerStatus = (statusFromGuess) => {
    let tempAnswerStatus = [...getAnswerStatus];
    for (let i = 0; i < statusFromGuess.length; i++) {
      if (statusFromGuess[i] === 2) {
        tempAnswerStatus[i] = true;
      }
    }
    setAnswerStatus([...tempAnswerStatus]);
  }

  // Update the object keeping track of the letter status.
  // Used to update the keyboard visual.
  //-1 = unset (default state)
  // 0 = letter not in word
  // 1 = letter in wrong place
  // 2 = letter in ccorrect place
  const updateLetterStatus = (statusObject, user) => {
    let scoreChange = 0;

    Object.keys(statusObject).forEach(function (letter) {
      if (getLetterStatus[letter] < statusObject[letter]) {
        let letterDifference = statusObject[letter] - getLetterStatus[letter];
        scoreChange += letterDifference
        // console.log("Letter difference: " + letterDifference);
        setLetterStatus(prevObject => ({
          ...prevObject,
          [letter]: statusObject[letter],
        }));
      }
    });
    updateScores(user, scoreChange);
  }

  const updateScores = (user, scoreChange) => {
    let currentScore = getUserScores[user] || 0;
    let newScore = currentScore + scoreChange;
    // console.log(user + "'s new score: " + newScore);
    setUserScores(prevObject => ({
      ...prevObject,
      [user]: newScore
    }));
  }


  // Set the answer to a new random word from the list
  const setAnswerAsRandomWord = () => {
    let newWord = getAnswer;

    // Make sure it's actually a new word (don't repeat the same word twice)
    while (newWord === getAnswer) {
      newWord = answerList[Math.floor(Math.random() * answerList.length)];
    }

    console.log(newWord);
    setAnswer(newWord);
  }

  // Reset the game board (called when the word is solved)
  const reset = () => {
    setAnswerAsRandomWord();
    setGuessArray([]);
    setChatArray([]);
    initializeLetterStatus();
    initializeAnswerStatus();
    setIsWordFound(false);
    setTimeoutStatus({});
  }

  const isUserTimedOut = (user) => {
    // console.log(getTimeoutStatus);
    return getTimeoutStatus[user];
  }

  const handleValidGuess = (word, user, color) => {
    // console.log(getGuessArray);
    setGuessArray(prevGuessArray => [...prevGuessArray, word]);
    let newChatEntry = [word, user, color];
    // console.log(getChatArray);
    setChatArray(prevChatArray => [...prevChatArray, newChatEntry]);
    timeoutUser(user);
  }

  // Function called when a new word is guessed
  const handleWordEntry = (word, user, color) => {
    if (!isUserTimedOut(user)) {
      if(isWordFound) { return } // word for this round has already been found
      if (word.length !== wordLength) { return } // not the right length
      if (getGuessArray.includes(word)) { return }; // already guessed
      if (wordList.includes(word)) { //If it's a valid word, add it the list of guesses so far
        handleValidGuess(word, user, color);
      }
      if (word === getAnswer) { //If it's the correct answer, show and alert and reset the game board
        setIsWordFound(true); // prevent future guesses until the game has reset
        updateScores(user, wordLength); // give bonus points for getting the answer
        setTimeout(function () {
          reset();
        }, 3000);
      }
    }
  }

  const addChatMessage = (word, user, color) => {
    let newChatMessage = [word, user, color];
    setChatMessages(prevChatMessages => [...prevChatMessages, newChatMessage]);
  }

  useEffect(() => {
    setAnswerAsRandomWord();
    initializeAnswerStatus();
    initializeLetterStatus();
  }, []);

  useEffect(() => {
    if (prevDependencyRef.current !== undefined) {
      let latestChat = getChatMessages[getChatMessages.length - 1];
      handleWordEntry(latestChat[0], latestChat[1], latestChat[2]);
    }
    prevDependencyRef.current = getChatMessages;
  }, [getChatMessages]);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.leftContainer}>
        <Scoreboard getUserScores={getUserScores} />
      </div>
      <div className={styles.middleContainer}>
        <BigLetters answer={getAnswer} answerStatus={getAnswerStatus} />
        <Keyboard letterStatus={getLetterStatus} />
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.wordBlockContainer}>
          {getChatArray.map((chatEntry, index) => (
            <WordBlock key={index} word={chatEntry[0]} user={chatEntry[1]} color={chatEntry[2]} answer={getAnswer} updateLetterStatus={updateLetterStatus} updateAnswerStatus={updateAnswerStatus} />
          ))}
        </div>
        <EntryField addChatMessage={addChatMessage} wordLength={wordLength} />
      </div>
    </div>
  )
}
