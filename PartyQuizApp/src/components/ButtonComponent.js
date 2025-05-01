import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import TextComponent from './TextComponent';
import COLORS from '@src/config/Colors';

const ButtonComponent = ({ text, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <TextComponent>{text}</TextComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  }
});

export default ButtonComponent;
