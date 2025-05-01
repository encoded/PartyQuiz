import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StartScreen from '@screens/StartScreen';
import HostScreen from '@screens/HostScreen';
import ClientScreen from '@screens/ClientScreen';

import SPACING from '@src/config/Spacing';
import NAVIGATION from '@src/config/Navigation';

const Stack = createStackNavigator();

// Header with button
const Header = ({ navigation }) => {

  const insets = useSafeAreaInsets(); // Get dynamic safe area insets

  return (
    <View style={{
      position: "absolute",
      alignItems: 'flex-start',
      height: SPACING.headerSize,
      paddingLeft: SPACING.paddingHorizontal,
      marginTop: insets.top
    }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Ionicons 
          name="arrow-back"  // You can replace this with any other icon
          size={24}  // Adjust size as needed
          color="white"  // Adjust color as needed
        />
      </TouchableOpacity>
    </View>
  );
};

const MenuStack = ({ route }) => {
  return (
    <Stack.Navigator initialRouteName={NAVIGATION.SCREENS.START}>
      <Stack.Screen 
        name={NAVIGATION.SCREENS.START}
        component={StartScreen} 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name={NAVIGATION.SCREENS.HOST}
        component={HostScreen} 
        options={({ navigation }) => ({
          header: () => <Header navigation={navigation} />,  // Custom header component
        })}
      />
      <Stack.Screen 
        name={NAVIGATION.SCREENS.CLIENT} 
        component={ClientScreen} 
        options={({ navigation }) => ({
          header: () => <Header navigation={navigation} />,  // Custom header component
        })}
      />
    </Stack.Navigator>
)};

export default MenuStack;