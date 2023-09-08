import { useEffect, useRef } from 'react';
import styles from './BigLetters.module.scss'
import BigLetter from './bigLetter';
import { gsap } from 'gsap';

function BigLetters(props) {
  const { answer, answerStatus, isWordFound } = props;
  const answerLettersArray = answer.split('');
  const marginRight = '20px';
  const contRef = useRef(null);

  const bringLettersOut = () => {
    const letterContainer = contRef.current;
    if (letterContainer && letterContainer.children.length) {
      const letters = letterContainer.children;
      const tl = gsap.timeline();
      tl.fromTo(letters, { y: 0 }, { y: 0, ease: "power2", duration: 3.5 });
      tl.fromTo(letters, { y: 0 }, { y: -200, ease: "power2", duration: 0.75, stagger: 0.1 });
    }
  }

  const bringLettersIn = () => {
    const letterContainer = contRef.current;
    if (letterContainer && letterContainer.children.length) {
      const letters = letterContainer.children;
      const tl = gsap.timeline();
      tl.fromTo(letters, { y: 200 }, { y: 0, ease: "power2", duration: 0.75, stagger: 0.1 });
    }
  }

  useEffect(() => {
    if (isWordFound === false) {
      bringLettersIn();
    } else if (isWordFound === true) {
      bringLettersOut();
    }
  }, [isWordFound, contRef?.current?.children]);


  return (

    <div className={styles.bigLetters} ref={contRef}>
      {answerLettersArray.map((letter, index) => (
        <BigLetter key={index} letter={letter} status={answerStatus[index]} width={`calc((100% - (${marginRight}*${answer.length - 1}))/${answer.length})`} />
      ))}
    </div>
  );
}

export default BigLetters;
