// PlayerOptionOverlay.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlayerOptionOverlay = ({ name }) => {
  if (!name) return null;

  return (
    <View style={styles.circle}>
      <Text style={styles.text}>{name[0]?.toUpperCase() || '?'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    marginTop: -10,
    marginRight: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D5B3FC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    zIndex: 10,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default PlayerOptionOverlay;
