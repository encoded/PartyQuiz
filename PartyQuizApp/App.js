import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { NetworkProvider } from '@src/context/NetworkContext';
import { ClientProvider } from '@src/context/ClientContext';
import { HostProvider } from '@src/context/HostContext';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import MenuStack from '@src/navigation/MenuStack';

export default function App() {
  
  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <HostProvider>
          <ClientProvider>
            <NavigationContainer>
              <MenuStack/>
            </NavigationContainer>
          </ClientProvider>
        </HostProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}
