import { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { gsap } from "gsap";

function KeyboardLetter(props) {
  const { letter, status, playPoint1Sound, playPoint2Sound, playPoint3Sound } =
    props;
  const scoreRef = useRef(null);
  const [getPrevStatus, setPrevStatus] = useState(-1);
  const [getScoreDiff, setScoreDiff] = useState();

  const animateScore = (status) => {
    let score = scoreRef.current;
    let tl = gsap.timeline();
    tl.fromTo(score, { opacity: 0 }, { opacity: 0, duration: 0.5 });
    tl.fromTo(
      score,
      { opacity: 1, y: 0 },
      {
        opacity: 0,
        y: -30,
        ease: "linear",
        duration: 1.5,
        onStart: () => {
          if (status === 0) {
            playPoint1Sound();
          } else if (status === 1) {
            playPoint2Sound();
          } else if (status === 2) {
            playPoint3Sound();
          }
        },
      }
    );
  };

  useEffect(() => {
    let diff = status - getPrevStatus;
    if (status === -1 || status === undefined) {
      // Keyboard was reset
      setScoreDiff();
    } else if (diff !== 0) {
      setScoreDiff(diff);
      animateScore(status);
    }
    setPrevStatus(status);
  }, [status]);

  return (
    <div
      className={`${styles.letter} ${status === 2 && styles.green} ${
        status === 1 && styles.yellow
      } ${status === 0 && styles.black}`}
    >
      <div
        ref={scoreRef}
        className={`${styles.score} ${status === 2 && styles.greenScore} ${
          status === 1 && styles.yellowScore
        } `}
      >
        +{getScoreDiff}
      </div>
      {letter}
    </div>
  );
}

export default KeyboardLetter;
