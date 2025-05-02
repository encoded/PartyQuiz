import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import LayoutScreen from './LayoutScreen';
import TextComponent from '@src/components/TextComponent';
import { useHost } from '@src/context/HostContext';

const HostScreen = () => {
  const { ipAddress, players, isServerConnected } = useHost();

  return (
    <LayoutScreen>
      <TextComponent style={styles.title}>Scan this QR code to join the game!</TextComponent>
      {!ipAddress && <Text>Loading IP...</Text>}
      {ipAddress && isServerConnected ? (
        <QRCode value={ipAddress} size={200} />
      ) : ipAddress && !isServerConnected ? (
        <TextComponent style={styles.errorText}>No running server on this device {ipAddress}</TextComponent>
      ) : null}

      <TextComponent style={styles.subtitle}>Players currently connected:</TextComponent>
      <ScrollView style={styles.playerList}>
        {players.length === 0 ? (
          <TextComponent>No players have joined yet.</TextComponent>
        ) : (
          players.map((player, index) => (
            <TextComponent key={index} style={styles.playerName}>
              {player.name}
            </TextComponent>
          ))
        )}
      </ScrollView>
    </LayoutScreen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  playerList: {
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  playerName: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center'
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
});

export default HostScreen;
