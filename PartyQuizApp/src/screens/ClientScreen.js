import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import CameraComponent from '@src/components/CameraComponent';
import { useClient } from '@src/context/ClientContext';
import LayoutScreen from './LayoutScreen';
import TextComponent from '@src/components/TextComponent';
import TextInputComponent from '@src/components/TextInputComponent';
import ButtonComponent from '@src/components/ButtonComponent';
import { getMinDimension } from '@src/config/Spacing';

const ClientScreen = () => {
  const [scanned, setScanned] = useState(false);
  const [inputIp, setInputIp] = useState('');
  const [inputName, setInputName] = useState('');
  const { connectToHost, isConnected } = useClient();
  const minDimension = getMinDimension();

  const handleBarCodeScanned = (result) => {
    if (!scanned && result?.data) {
      setScanned(true);
      setInputIp(result.data);
    }
  };

  const handleJoin = () => {
    connectToHost(inputIp, inputName);
  };

  return (
    <LayoutScreen>
      {isConnected ? (
        <TextComponent style={styles.text}>Connection successful!{'\n\n'}Waiting for other players...</TextComponent>
      ) :
      (
        !scanned ? (
        <View style={[styles.cameraContainer, {width: minDimension * 0.8}]}>
          <CameraComponent onBarcodeScanned={handleBarCodeScanned} />
        </View>
        ) :
        (
          <View style={styles.inputContainer}>
            <TextComponent style={styles.text}>Enter your name:</TextComponent>
            <TextInputComponent
              style={{width:'80%', }}
              placeholder="Enter your name"
              value={inputName}
              onChangeText={setInputName}
            />
            <ButtonComponent text="Join" onPress={handleJoin} />
          </View>
        )
      )}
    </LayoutScreen>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    aspectRatio: 1
  },
  inputContainer: { 
    width: '100%', 
    alignItems: 'center' 
  },
  text: { 
    fontSize: 18, 
    marginBottom: 10,
    textAlign: "center"
  },
});

export default ClientScreen;
