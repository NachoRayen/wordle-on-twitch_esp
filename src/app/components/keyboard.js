import styles from './Keyboard.module.scss'
import KeyboardLetter from './keyboardLetter';

function Keyboard(props) {
  const { letterStatus, playPoint1Sound, playPoint2Sound, playPoint3Sound } = props;
  const row1Letters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const row2Letters = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const row3Letters = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  return (
    <div className={styles.keyboard}>
      <div className={styles.row}>
        {row1Letters.map((letter) => (
          <KeyboardLetter key={letter} letter={letter} status={letterStatus[letter]}  playPoint1Sound={playPoint1Sound}  playPoint2Sound={playPoint2Sound} playPoint3Sound={playPoint3Sound} />
        ))}
      </div>
      <div className={styles.row}>
        {row2Letters.map((letter) => (
          <KeyboardLetter key={letter} letter={letter} status={letterStatus[letter]}  playPoint1Sound={playPoint1Sound}  playPoint2Sound={playPoint2Sound} playPoint3Sound={playPoint3Sound} />
        ))}
      </div>
      <div className={styles.row}>
        {row3Letters.map((letter) => (
          <KeyboardLetter key={letter} letter={letter} status={letterStatus[letter]}  playPoint1Sound={playPoint1Sound}  playPoint2Sound={playPoint2Sound} playPoint3Sound={playPoint3Sound} />
        ))}
      </div>
    </div>
  );
}

export default Keyboard;
