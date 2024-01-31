import styles from "./index.module.scss";

function WordLetter(props) {
  const { letter, status, length } = props;

  return (
    <div
      className={`${styles.letter} ${status === 2 && styles.green} ${
        status === 1 && styles.yellow
      }`}
      style={{
        "--w": `calc(min(60px, 3.75vw) * 5 / ${length})`,
      }}
    >
      {letter}
    </div>
  );
}

export default WordLetter;
