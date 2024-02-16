"use client";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import Scoreboard from "../Scoreboard";
import Keyboard from "../Keyboard";
import BigLetters from "../BigLetters";
import WordBlock from "../WordBlock";
import EntryField from "../EntryField";
import answerList from "@/app/data/5letters/solutionwords.json";
import wordList from "@/app/data/5letters/words.json";
import { LetterStatus } from "@/app/types/enums";
import { Client } from "tmi.js";

import {
  Chat,
  LetterStatusObject,
  Sound,
  TimeoutStatusObject,
  UserScoresObject,
} from "@/app/types/types";

const SOUNDS = {
  whooshSound: { file: "/sounds/whoosh.wav", volume: 0.5 },
  pointSound1: { file: "/sounds/coin3.wav", volume: 0.3 },
  pointSound2: { file: "/sounds/coin2.wav", volume: 0.4 },
  pointSound3: { file: "/sounds/coin.wav", volume: 0.5 },
  cardSound: { file: "/sounds/card.wav", volume: 1.0 },
  winSound: { file: "/sounds/success.wav", volume: 0.5 },
} as const;

const BETWEEN_ROUND_DELAY = 4500;
const TIMEOUT_LENGTH = 3000; // How long a user is timed out for, in milliseconds

type GameProps = {
  client: Client;
};

const Game: React.FC<GameProps> = ({ client }) => {
  const [getAnswer, setAnswer] = useState(""); // The current word solution
  const [getGuessArray, setGuessArray] = useState<string[]>([]); // Array of all words guessed this round
  const [getChatArray, setChatArray] = useState<Chat[]>([]); // Array of all valid chat guesses (as chat objects) this round
  const [getLatestChat, setLatestChat] = useState<Chat>(); // The latest chat message that will be checked for validity
  const [getLetterFoundArray, setLetterFoundArray] = useState<boolean[]>([]); // Array detecting the found status of each individual letter in the solution
  const [getLetterStatus, setLetterStatus] = useState<LetterStatusObject>({}); // Object tracking the status of each letter in the alphabet for this round
  const [getTimeoutStatus, setTimeoutStatus] = useState<TimeoutStatusObject>(
    {}
  ); // Object tracking the timeout status of each user
  const [getUserScores, setUserScores] = useState<UserScoresObject>({}); // Object tracking the scores of each user
  const [isWordFound, setIsWordFound] = useState(false); // Turns true after the word has been solved, blocking guesses until the round is reset
  const wordLength = 5; // Length of the solution and valid guesses
  const isConnected = client !== null;

  /**
   * Load the sounds into the game
   */
  const preloadSounds = () => {
    Object.values(SOUNDS).forEach((sound) => {
      const audio = new Audio(sound.file);
      audio.volume = sound.volume;
      audio.preload = "auto";
    });
  };

  /**
   * Play a given sound
   *
   * @param {Sound} soundObject - Sound to be played
   */
  const playSound = (soundObject: Sound): void => {
    const soundFile = new Audio(soundObject.file);
    soundFile.volume = soundObject.volume;
    soundFile.play();
  };

  /**
   * Time out a user, preventing them from guessing for the TIMEOUT_LENGTH variable
   *
   * @param {string} user - user to time out
   */
  const timeoutUser = (user: string) => {
    setTimeoutStatus((prevObject) => ({
      ...prevObject,
      [user]: true,
    }));
    setTimeout(function () {
      setTimeoutStatus((prevObject) => ({
        ...prevObject,
        [user]: false,
      }));
    }, TIMEOUT_LENGTH);
  };

  /**
   * Reset the object keeping track of the status of each letter in the alphabet, setting them all as "unset"
   */
  const initializeLetterStatus = () => {
    const qwertyAlphabet = "qwertyuiopasdfghjklzxcvbnm";
    const tempLetterStatus = qwertyAlphabet.split("").reduce((acc, letter) => {
      acc[letter] = LetterStatus.Unset;
      return acc;
    }, {});

    setLetterStatus(tempLetterStatus);
  };

  /**
   * Update the object keeping track of whether or not each letter in the answer has been "found". Used to update the big letter visual.
   * Each time a word is guessed, it calls this function, passing on the status of each of the letters in the word. If any of them are "LetterInCorrectPlace",
   * then that letter has been found, and the state will be updated accordingly.
   * It never changes it back to false because you cannot "unfind" a letter. (initializeLetterFoundArray is used to reset after the word is found)
   * false = letter not yet found (default state)
   * true = letter in correct place
   *
   * @param {LetterStatus[]} statusFromGuess - The array of letter statuses from a guess.
   */
  const updateLetterFoundArray = (statusFromGuess) => {
    const tempLetterFoundArray = [...getLetterFoundArray];
    for (let i = 0; i < statusFromGuess.length; i++) {
      if (statusFromGuess[i] === LetterStatus.LetterInCorrectPlace) {
        tempLetterFoundArray[i] = true;
      }
    }
    setLetterFoundArray([...tempLetterFoundArray]);
  };

  /**
   * When a word is guessed, the WordBlock component gets the letter status of each letter in the guess and passes it to this function,
   * which updates the state if a letter's status has increased.
   * The letter "status" increases by 1 in the following order, and the user is given points based on the jump between statuses:
   * 0 = unset (default state)
   * 1 = letter not in word
   * 2 = letter in wrong place
   * 3 = letter in correct place
   *
   * @param {LetterStatusObject} statusObject - The object containing the letter state of the letters from a guess
   * @param {string} user - The user who made the guess and whose score will be updated
   */
  const updateLetterStatus = (
    statusObject: LetterStatusObject,
    user: string
  ) => {
    let scoreChange = 0;

    Object.keys(statusObject).forEach(function (letter) {
      if (getLetterStatus[letter] < statusObject[letter]) {
        // Only update if the status has increased in value
        const letterDifference = statusObject[letter] - getLetterStatus[letter];
        scoreChange += letterDifference;
        setLetterStatus((prevObject) => ({
          ...prevObject,
          [letter]: statusObject[letter],
        }));
      }
    });
    updateScore(user, scoreChange);
  };

  /**
   * Increase a user's score by a given amount
   *
   * @param {string} user - User whose score will change
   * @param {number} scoreChange - Interval to increase the score by
   */
  const updateScore = (user: string, scoreChange: number) => {
    const currentScore = getUserScores[user] || 0;
    const newScore = currentScore + scoreChange;
    setUserScores((prevObject) => ({
      ...prevObject,
      [user]: newScore,
    }));
  };

  /**
   * Set the answer to a new random word from the list
   */
  const setAnswerAsRandomWord = () => {
    let newWord = getAnswer;

    // Make sure it's actually a new word (don't repeat the same word twice)
    while (newWord === getAnswer) {
      newWord = answerList[Math.floor(Math.random() * answerList.length)];
    }

    setAnswer(newWord);
  };

  /**
   * Reset the game board after a word is solved
   */
  const reset = () => {
    setAnswerAsRandomWord();
    setGuessArray([]);
    setChatArray([]);
    initializeLetterStatus();
    setLetterFoundArray(Array(wordLength).fill(false));
    setIsWordFound(false);
    setTimeoutStatus({});
  };

  /**
   * Process a chat object containing a valid guess, updating the guess and chat arrays and checking if the word was solved.
   *
   * @param {Chat} newChat - The chat object containing the valid guess
   */
  const handleValidGuess = (newChat: Chat) => {
    const word = newChat.word.trim();

    setGuessArray((prevGuessArray) => [...prevGuessArray, word]);
    setChatArray((prevChatArray) => [...prevChatArray, newChat]);
    timeoutUser(newChat.user);

    if (word === getAnswer) {
      //If it's the correct answer, prevent subsequent guesses and reset the game board
      setIsWordFound(true); // prevent subsequent guesses until the game has reset
      updateScore(newChat.user, wordLength); // give bonus points for getting the answer
      setTimeout(function () {
        reset();
      }, BETWEEN_ROUND_DELAY);
    }
  };

  /**
   * Run checks on the new chat message and, if a valid guess, call handleValidGuess on it.
   *
   * @param {Chat} newChat - The chat that is being checked for validity
   */
  const handleChatEntry = (newChat: Chat) => {
    const { word, user } = newChat;

    if (
      !getTimeoutStatus[user] && // User is not timed out
      !isWordFound && // Word hasn't already been found this round
      word.length === wordLength && // Word is the correct length
      !getGuessArray.includes(word) && // Word isn't already guessed
      wordList.includes(word) // Word is in the valid word list
    ) {
      handleValidGuess(newChat);
    }
  };

  /**
   * Play the "cardSound" once for each letter in the word
   */
  const playCardSounds = () => {
    let count = wordLength;

    const cardSoundFile = new Audio(SOUNDS.cardSound.file);
    cardSoundFile.volume = SOUNDS.cardSound.volume;

    const playCardSound = () => {
      cardSoundFile.currentTime = 0;
      cardSoundFile.play();

      count -= 1;
      if (count > 0) {
        setTimeout(playCardSound, 100);
      }
    };

    playCardSound();
  };

  /**
   * Call handleChatEntry when a new chat is added
   */
  useEffect(() => {
    if (getLatestChat) {
      handleChatEntry(getLatestChat);
    }
  }, [getLatestChat]);

  /**
   * On initial mounting, start listening for chat messages if connected to twitch, and do the set up for the first round.
   */
  useEffect(() => {
    if (isConnected) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      client.on("message", (channel, tags, message, self) => {
        const word = message.trim(); //twitch adds white space to allow the broadcaster to repeat the same chat repeatedly it seems
        const user = tags["display-name"] || "User";
        const color = tags["color"] || "#FFFFFF";
        const isMod = tags.mod === true || tags.badges?.broadcaster === "1";

        const newChat: Chat = {
          word: word,
          user: user,
          color: color,
          isMod: isMod,
        };

        setLatestChat(newChat);
      });
    }

    setAnswerAsRandomWord();
    setLetterFoundArray(Array(wordLength).fill(false));
    initializeLetterStatus();
    preloadSounds();
  }, []);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.leftContainer}>
        <Scoreboard getUserScores={getUserScores} />
      </div>
      <div className={styles.middleContainer}>
        <div className={styles.header}>
          <h1>Wordle on Twitch</h1>
          <h2>https://wordle-on-twitch.vercel.app/</h2>
        </div>
        <BigLetters
          answer={getAnswer}
          letterFoundArray={getLetterFoundArray}
          isWordFound={isWordFound}
          playCardSounds={playCardSounds}
        />
        <Keyboard
          letterStatus={getLetterStatus}
          playPoint1Sound={() => playSound(SOUNDS.pointSound1)}
          playPoint2Sound={() => playSound(SOUNDS.pointSound2)}
          playPoint3Sound={() => playSound(SOUNDS.pointSound3)}
        />
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.wordBlockContainer}>
          {getChatArray.map((chatEntry, index) => (
            <WordBlock
              key={index}
              chat={chatEntry}
              timeoutLength={TIMEOUT_LENGTH}
              answer={getAnswer}
              updateLetterStatus={updateLetterStatus}
              updateLetterFoundArray={updateLetterFoundArray}
              playWinSound={() => playSound(SOUNDS.winSound)}
              playWhooshSound={() => playSound(SOUNDS.whooshSound)}
            />
          ))}
        </div>
        {!client && (
          <EntryField
            handleChatEntry={handleChatEntry}
            wordLength={wordLength}
          />
        )}
      </div>
    </div>
  );
};

export default Game;
