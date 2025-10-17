import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './App/HomeScreen';
// import Model from './App/Model';

export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
      {/* <Model /> */}
    </SafeAreaProvider>
  );
}

