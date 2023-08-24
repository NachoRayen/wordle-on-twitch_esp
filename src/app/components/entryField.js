import React, { useState } from 'react';
import styles from './EntryField.module.scss'

function EntryField(props) {
  const { handleWordEntry } = props;
  const [getWord, setWord] = useState('');

  const handleInputChange = (event) => {
    setWord(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleButtonClick();
    }
  };

  const handleButtonClick = () => {
    if(getWord.length == 5){
      document.getElementById("wordInput").value = ""; //Clear input field
      handleWordEntry(getWord);
    }
  }

  return (
    <div className={styles.entryContainer}>
      <input type="text" id="wordInput" name="wordInput" className={styles.entryField} maxLength="5" onChange={handleInputChange} onKeyDown={handleKeyPress}></input>
      <button className={styles.entryButton} onClick={handleButtonClick}>Enter</button>
    </div>
  );
}

export default EntryField;
