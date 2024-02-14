import { useState, useEffect, useRef, RefObject } from "react";
import styles from "./index.module.scss";
import { gsap } from "gsap";
import { LetterStatus } from "@/app/types/enums";

type KeyboardLetterProps = {
  letter: string;
  status: LetterStatus;
  playPoint1Sound: () => void;
  playPoint2Sound: () => void;
  playPoint3Sound: () => void;
};

const KeyboardLetter: React.FC<KeyboardLetterProps> = ({
  letter,
  status,
  playPoint1Sound,
  playPoint2Sound,
  playPoint3Sound,
}) => {
  const scoreRef: RefObject<HTMLDivElement> = useRef(null);
  const [getPreviousStatus, setPreviousStatus] = useState(LetterStatus.Unset);
  const [getScoreChangeAmount, setScoreChangeAmount] = useState<number>(0);

  /**
   * Play the animation for the score event based on what the letter status has changed to
   *
   * @param {LetterStatus} status - The new letter status
   */
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
          switch (status) {
            case LetterStatus.LetterNotInWord:
              playPoint1Sound();
              break;
            case LetterStatus.LetterInWrongPlace:
              playPoint2Sound();
              break;
            case LetterStatus.LetterInCorrectPlace:
              playPoint3Sound();
              break;
          }
        },
      }
    );
  };

  /**
   * When the letter status changes, update the scoring amount and play the scoring animation if necessary
   */
  useEffect(() => {
    let scoreDifference = status - getPreviousStatus; // Each letter status has a corresponding value; subtract the previous status from the new status to get the value difference
    if (status === LetterStatus.Unset) {
      // If the status was changed to "unset", then the keyboard was reset because a new round started
      setScoreChangeAmount(0);
      setPreviousStatus(LetterStatus.Unset);
    } else if (scoreDifference !== 0) {
      setScoreChangeAmount(scoreDifference);
      // Play the animation, text color based on the new status
      animateScore(status);
      // Update the PreviousStatus state for the next time the score change is calculated
      setPreviousStatus(status);
    }
  }, [status]);

  return (
    <div
      className={`${styles.letter} ${
        status === LetterStatus.LetterInCorrectPlace
          ? styles.green
          : status === LetterStatus.LetterInWrongPlace
          ? styles.yellow
          : status === LetterStatus.LetterNotInWord
          ? styles.black
          : ""
      }`}
    >
      <div
        ref={scoreRef}
        className={`${styles.score} ${
          status === LetterStatus.LetterInCorrectPlace
            ? styles.greenScore
            : status === LetterStatus.LetterInWrongPlace
            ? styles.yellowScore
            : ""
        } `}
      >
        +{getScoreChangeAmount}
      </div>
      {letter}
    </div>
  );
};

export default KeyboardLetter;
