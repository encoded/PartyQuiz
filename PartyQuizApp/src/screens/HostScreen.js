import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import LayoutScreen from './LayoutScreen';
import TextComponent from '@src/components/TextComponent';
import { useHost } from '@src/context/HostContext';
import ButtonComponent from '@src/components/ButtonComponent';
import { useNavigation } from '@react-navigation/native';
import NAVIGATION from '@src/config/Navigation';
import { CLIENT_TO_SERVER, SERVER_TO_CLIENT } from '@shared/messages';

const HostScreen = () => {
  const { ipAddress, players, isServerConnected, incomingMessageData, sendMessage } = useHost();
  const navigation = useNavigation();

  // Listen to server game start to move onto the game screen
  useEffect(()=>{
    if(incomingMessageData && incomingMessageData.type === SERVER_TO_CLIENT.GAME_START)
    {
      navigation.navigate(NAVIGATION.SCREENS.HOST_GAME);
    }
  }, [incomingMessageData]);

  return (
    <LayoutScreen style={styles.container}>
      <TextComponent style={styles.title}>Scan this QR code to join the game!</TextComponent>
      {!ipAddress && <Text>Loading IP...</Text>}
      {ipAddress && isServerConnected ? (
        <QRCode value={ipAddress} size={200} />
      ) : ipAddress && !isServerConnected ? (
        <TextComponent style={styles.errorText}>No running server on this device {ipAddress}</TextComponent>
      ) : null}

      <TextComponent style={styles.subtitle}>Players currently connected:</TextComponent>
      <View style={styles.playerList}>
        {players.length === 0 ? (
          <TextComponent style={styles.playerName}>No players have joined yet.</TextComponent>
        ) : (
          <FlatList
            data={players}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TextComponent style={styles.playerName}>{item.name}</TextComponent>
            )}
            scrollEnabled={players.length > 5} // scroll only if too many
            style={styles.playerList}
            contentContainerStyle={{ flexGrow: 0, rowGap: 10}} // critical: prevents stretching
          />
        )}
      </View>

      <ButtonComponent
        text={"Start Game"}
        onPress={()=>sendMessage({type: CLIENT_TO_SERVER.START_GAME})}
        disabled={players.length == 0}
      />
    </LayoutScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    rowGap: 20,
  },  
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 16
  },
  playerList: {
    width: '100%',
    paddingHorizontal: 20
  },
  playerName: {
    fontSize: 16,
    textAlign: 'center'
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
});

export default HostScreen;
