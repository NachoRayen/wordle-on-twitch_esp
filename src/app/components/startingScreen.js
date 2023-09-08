import React, { useState } from 'react';
import styles from './StartingScreen.module.scss'

function StartingScreen(props) {
  const { changeChannel } = props;
  const [getChannel, setChannel] = useState('');

  const handleInputChange = (event) => {
    setChannel(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleButtonClick();
    }
  };

  const handleButtonClick = () => {
    changeChannel(getChannel);
  }

  return (
    <div className={styles.startingScreen}>
      <span className={styles.text}>Insert Twitch Channel: </span>
      <input type="text" id="userInput" name="userInput" className={styles.input} onChange={handleInputChange} onKeyDown={handleKeyPress}></input>
      <button className={styles.button} onClick={handleButtonClick}>Connect</button>
    </div>
  );
}

export default StartingScreen;
