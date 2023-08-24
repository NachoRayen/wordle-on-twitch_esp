import styles from './WordLetter.module.scss'

function WordLetter(props) {
const { letter, status } = props;

  return (
    <div className={`${styles.letter} ${status == 2 ? styles.green : ''} ${status == 1 ? styles.yellow : ''}`}>
        {letter}
    </div>
  );
}

export default WordLetter;
