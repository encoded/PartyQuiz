import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Colors from '@src/config/Colors';

const TextComponent = (props) => {
  const { children, style, ...rest} = props;

  return (
    <Text style={[styles.text, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TextComponent;
