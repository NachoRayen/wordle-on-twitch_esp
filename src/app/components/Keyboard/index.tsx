import styles from "./index.module.scss";
import KeyboardLetter from "../KeyboardLetter";
import { LetterStatusObject } from "@/app/types/types";

const LETTER_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
] as const;

type KeyboardProps = {
  letterStatus: LetterStatusObject;
  playPoint1Sound: () => void;
  playPoint2Sound: () => void;
  playPoint3Sound: () => void;
};

const Keyboard: React.FC<KeyboardProps> = ({
  letterStatus,
  playPoint1Sound,
  playPoint2Sound,
  playPoint3Sound,
}) => {
  return (
    <div className={styles.keyboard}>
      {LETTER_ROWS.map((row) => (
        <div className={styles.row} key={row.join("")}>
          {row.map(
            (letter) =>
              letterStatus[letter] !== undefined && (
                <KeyboardLetter
                  key={letter}
                  letter={letter}
                  status={letterStatus[letter]}
                  playPoint1Sound={playPoint1Sound}
                  playPoint2Sound={playPoint2Sound}
                  playPoint3Sound={playPoint3Sound}
                />
              )
          )}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
