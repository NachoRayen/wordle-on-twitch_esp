import React, { useState } from "react";
import styles from "./EntryField.module.scss";

function EntryField(props) {
  const { addChatMessage, wordLength } = props;
  const [getWord, setWord] = useState("");
  const handleInputChange = (event) => {
    setWord(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleButtonClick();
    }
  };

  const handleButtonClick = () => {
    if (getWord.length === wordLength) {
      document.getElementById("wordInput").value = ""; //Clear input field
      addChatMessage(getWord, "User", "#FFFFF");
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
      ></input>
      <button className={styles.entryButton} onClick={handleButtonClick}>
        Enter
      </button>
    </div>
  );
}

export default EntryField;
