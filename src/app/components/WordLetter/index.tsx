import React from "react";
import styles from "./index.module.scss";
import { LetterStatus } from "@/app/types/enums";

type WordLetterProps = {
  status: LetterStatus;
  letter: string;
  length: number;
};

const WordLetter: React.FC<WordLetterProps> = ({ letter, status, length }) => {
  return (
    <div
      className={`${styles.letter} ${
        status === LetterStatus.LetterInCorrectPlace && styles.green
      } ${status === LetterStatus.LetterInWrongPlace && styles.yellow}`}
      style={
        {
          "--w": `calc(min(60px, 3.75vw) * 5 / ${length})`,
        } as React.CSSProperties
      }
    >
      {letter}
    </div>
  );
};

export default WordLetter;
