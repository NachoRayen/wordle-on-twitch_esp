import React from "react";
import styles from "./index.module.scss";

type BigLetterItemProps = {
  letter: string;
  isLetterFound: boolean;
  width: string;
};

const BigLetterItem: React.FC<BigLetterItemProps> = ({
  letter,
  isLetterFound,
  width,
}) => {
  const setLetterClasses = (): string => {
    return `${styles.letter} ${isLetterFound ? styles.green : ""}`.trim();
  };

  return (
    <div
      className={setLetterClasses()}
      style={{ "--w": width } as React.CSSProperties}
    >
      <span className={styles.text}>{isLetterFound ? letter : ""}</span>
    </div>
  );
};

export default BigLetterItem;
