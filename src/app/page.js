'use client';
import React, { useState, useEffect } from 'react';
import './page.module.scss'
import styles from './page.module.scss'
import StartingScreen from './components/startingScreen';
import Game from './components/game';

export default function Home() {
  const [getClient, setClient] = useState(undefined)
  const [getChannel, setChannel] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const tmi = require('tmi.js');

  const changeChannel = (channel) => {
    setChannel(channel);
  }

  useEffect(() => {
    if (getClient) {
      setIsConnecting(true);
      let tryConnection;
      let connectionTries = 0;

      const checkConnection = () => {
        if (getClient.channels.length > 0) {
          setIsConnected(true);
          clearInterval(tryConnection);
          //update router?
        } else if (connectionTries >= 5) {
          clearInterval(tryConnection);
          alert("Connection failed");
          setChannel('');
          setIsConnecting(false);
        } else {
          connectionTries++;
        }
      };

      tryConnection = setInterval(checkConnection, 500);
    }
  }, [getClient]);

  useEffect(() => {
    if (getChannel) {
      let client = new tmi.Client({
        channels: [getChannel]
      })
      setClient(client);
      client.connect();
    }
  }, [getChannel]);

  useEffect(() => {
    // Parse the URL parameters to get the "channel" parameter
    const searchParams = new URLSearchParams(location.search);
    const channelParam = searchParams.get('channel');

    if (channelParam) {
      setIsConnecting(true);
      setChannel(channelParam);
    }
    setIsLoading(false);
  }, []);

  return (
    <main className={styles.main}>
      {!isConnected ? (
        !isConnecting ? (
          !isLoading ? (
            <StartingScreen changeChannel={changeChannel} />
          ) : (
            <span>Loading...</span>
          )
        ) : (
          <span>Connecting...</span>
        )
      ) : (
        <Game client={getClient} />
      )}
    </main>
  )
}
