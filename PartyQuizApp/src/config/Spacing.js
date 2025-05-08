import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SIZES from "./Sizes";

// Default margin and padding values
const SPACING = {
  paddingHorizontal: SIZES.large,
  headerSize: SIZES.xXLarge
};

export const getMarginTop = () => {
  const insets = useSafeAreaInsets();
  return Platform.OS === 'web' ? SIZES.small : insets.top;
};

export const getMarginBottom = () => {
  const insets = useSafeAreaInsets();
  return Platform.OS === 'web' ? SIZES.small : insets.bottom;
};

export const getMaxDimension = () => {
  const { width, height } = useWindowDimensions();
  return Math.max(width, height);
};

export const getMinDimension = () => {
  const { width, height } = useWindowDimensions();
  return Math.min(width, height);
};

export default SPACING;