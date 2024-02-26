import React, { ChangeEvent, useState } from "react";
import styles from "./index.module.scss";
import { Chat } from "@/app/types/types";

type EntryFieldProps = {
  handleChatEntry: (newChatMessage: Chat) => void;
  wordLength: number;
};

const EntryField: React.FC<EntryFieldProps> = ({
  handleChatEntry,
  wordLength,
}) => {
  const [getWord, setWord] = useState(""); // Current value of the entry field

  /**
   * Update the state when the input field changes
   *
   * @param event
   */
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWord(event.target.value);
  };

  /**
   * When a key is pressed, check if it's enter, and process it as a button click if it is
   *
   * @param event
   */
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleButtonClick();
    }
  };

  /**
   * When the submit button is clicked, call the function to process the chat entry
   */
  const handleButtonClick = () => {
    const word = getWord.toLowerCase();
    if (getWord.length === wordLength) {
      setWord(""); //Clear input field
      const newChatMessage: Chat = {
        word: word,
        user: "User",
        color: "#FFFFFF",
        isMod: true,
      };
      handleChatEntry(newChatMessage);
    }
  };

  return (
    <div className={styles.entryContainer}>
      <input
        type="text"
        id="wordInput"
        name="wordInput"
        className={styles.entryField}
        maxLength={wordLength}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        value={getWord}
      ></input>
      <button className={styles.entryButton} onClick={handleButtonClick}>
        Enter
      </button>
    </div>
  );
};

export default EntryField;
