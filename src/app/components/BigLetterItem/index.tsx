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
  return (
    <div
      className={`${styles.letter} ${
        isLetterFound === true ? styles.green : ""
      }`}
      style={{ "--w": width } as React.CSSProperties}
    >
      <span className={styles.text}>
        {isLetterFound === true ? letter : ""}
      </span>
    </div>
  );
};

export default BigLetterItem;
