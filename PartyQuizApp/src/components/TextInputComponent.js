import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import Colors from '@src/config/Colors';

const TextInputComponent = (props) => {
  const { children, style, ...rest} = props;

  return (
    <TextInput 
      style={[styles.input, style]} 
      placeholderTextColor={'#ccc'}
      textAlignVertical="center" 
      {...rest}
    >
      {children}
    </TextInput>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%', 
    height: 50, 
    borderColor: '#ccc',
    borderWidth: 1, 
    paddingLeft: 10,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  }
});

export default TextInputComponent;
