import styles from "./BigLetter.module.scss";

function BigLetter(props) {
  const { letter, status, width } = props;

  return (
    <div
      className={`${styles.letter} ${status === true && styles.green}`}
      style={{ "--w": width }}
    >
      <span className={styles.text}>{status === true && letter}</span>
    </div>
  );
}

export default BigLetter;
