import { useState, useEffect, useRef } from 'react';
import styles from './KeyboardLetter.module.scss'
import { gsap } from 'gsap';

function KeyboardLetter(props) {

  const scoreRef = useRef(null);
  const { letter, status } = props;
  const [getPrevStatus, setPrevStatus] = useState(-1);
  const [getScoreDiff, setScoreDiff] = useState();

  const animateScore = () => {
    let score = scoreRef.current;
    gsap.fromTo(score, { opacity: 1, y: 0 }, { opacity: 0, y: -30, ease: "linear", duration: 1.5 });
  }

  useEffect(() => {
    let diff = status - getPrevStatus;
    if (status === -1 || status === undefined) {
      // Keyboard was reset
      setScoreDiff();
    } else if (diff !== 0 ) {
      setScoreDiff(diff);
      animateScore();
    }
    setPrevStatus(status);
  }, [status]);

  return (
    <div className={`${styles.letter} ${status === 2 ? styles.green : ''} ${status === 1 ? styles.yellow : ''} ${status === 0 ? styles.black : ''}`}>
      <div ref={scoreRef} className={`${styles.score} ${status === 2 ? styles.greenScore : ''} ${status === 1 ? styles.yellowScore : ''} `}>+{getScoreDiff}</div>
      {letter}
    </div>
  );
}

export default KeyboardLetter;
