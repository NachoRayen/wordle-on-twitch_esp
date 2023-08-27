import styles from './KeyboardLetter.module.scss'

function KeyboardLetter(props) {
const { letter, status } = props;

  return (
    <div className={`${styles.letter} ${status === 2 ? styles.green : ''} ${status === 1 ? styles.yellow : ''} ${status === 0 ? styles.black : ''}`}>
        {letter}
    </div>
  );
}

export default KeyboardLetter;
