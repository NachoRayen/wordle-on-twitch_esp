import styles from './BigLetters.module.scss'
import BigLetter from './bigLetter';

function BigLetters(props) {
  const { answer, answerStatus } = props;
  const answerLettersAraray = answer.split('');
  const marginRight = '20px';

  return (

    <div className={styles.bigLetters}>
      {answerLettersAraray.map((letter, index) => (
          <BigLetter key={index} letter={letter} status={answerStatus[index]} width={`calc((100% - (${marginRight}*${answer.length - 1}))/${answer.length})`} />
        ))}
    </div>
  );
}

export default BigLetters;
