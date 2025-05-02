import React from 'react';
import { View, StyleSheet } from 'react-native';
import COLORS from '@src/config/Colors';
import SPACING from '@src/config/Spacing';

import { getMarginBottom, getMarginTop } from '@src/config/Spacing';

export default function LayoutScreen({ children, style }) {
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: getMarginTop() + SPACING.headerSize,
          paddingBottom: getMarginBottom()
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.paddingHorizontal
  },
});
