'use client';
import React from 'react';
import './page.module.scss'
import styles from './page.module.scss'
import Game from './components/game';

export default function Home() {

  return (
    <main className={styles.main}>
      <Game />
    </main>
  )
}
