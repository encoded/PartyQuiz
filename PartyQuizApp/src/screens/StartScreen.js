import React, {useEffect} from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import ButtonComponent from '@src/components/ButtonComponent';
import LayoutScreen from './LayoutScreen';
import TextComponent from '@src/components/TextComponent';

import NAVIGATION from '@src/config/Navigation';

export default function StartScreen({ navigation }) {  
  return (
    <LayoutScreen>
      <TextComponent style={styles.title}>Welcome to PartyQuiz!</TextComponent>
      <ButtonComponent
        text="Host Game"
        onPress={() => navigation.navigate(NAVIGATION.SCREENS.HOST)}
      />
      <ButtonComponent
        text="Join Game"
        onPress={() => navigation.navigate(NAVIGATION.SCREENS.CLIENT)}
      />
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 48,
  },
});
