'use client';
import React, { useState, useEffect } from 'react';
import styles from './Game.module.scss';
import Keyboard from './keyboard';
import WordBlock from './wordBlock';
import EntryField from './entryField';
import answerList from '../solutionwords.json';
import wordList from '../words.json';

export default function Game() {
  const [getAnswer, setAnswer] = useState("");
  const [getGuessArray, setGuessArray] = useState([]);
  const [getLetterStatus, setLetterStatus] = useState({});
  const wordLength = 5;


  // Reset the object keeping track of the letter status to all -1
  const initializeLetterStatus = () => {
    const qwertyAlphabet = "qwertyuiopasdfghjklzxcvbnm";
    const tempLetterStatus = {};

    for (let i = 0; i < qwertyAlphabet.length; i++) {
      tempLetterStatus[qwertyAlphabet[i]] = -1;
    }

    setLetterStatus(tempLetterStatus);
  }

  // Update the object keeping track of the letter status
  //-1 = unset (default state)
  // 0 = letter not in word
  // 1 = letter in wrong place
  // 2 = letter in ccorrect place
  const updateLetterStatus = (statusObject) => {
    Object.keys(statusObject).forEach(function (letter) {
      if (getLetterStatus[letter] < statusObject[letter]) {
        setLetterStatus(prevObject => ({
          ...prevObject,
          [letter]: statusObject[letter],
        }));
      }
    });
  }

  // Add a word to the array of guessed words
  const updateGuessArray = newWord => {
    setGuessArray([...getGuessArray, newWord]);
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
    initializeLetterStatus();
  }

  // Function called when a new word is guessed
  const handleWordEntry = word => {
    if (word.length !== wordLength) { return } // not the right length
    if (getGuessArray.includes(word)) { return }; // already guessed
    if (wordList.includes(word)) { //If it's a valid word, add it the list of guesses so far
      updateGuessArray(word);
    }
    if (word === getAnswer) { //If it's the correct answer, show and alert and reset the game board
      setTimeout(function () {
        alert("Correct!");
        reset();
      }, 300);
    }
  }

  useEffect(() => {
    setAnswerAsRandomWord();
    initializeLetterStatus();
  }, []);

  return (
    <>
      <Keyboard letterStatus={getLetterStatus} />
      <div className={styles.rightContainer}>
        <div className={styles.wordBlockContainer}>
          {getGuessArray.map((word, index) => (
            <WordBlock key={index} word={word} answer={getAnswer} updateLetterStatus={updateLetterStatus} />
          ))}
        </div>
        <EntryField handleWordEntry={handleWordEntry} wordLength={wordLength} />
      </div>
    </>
  )
}
