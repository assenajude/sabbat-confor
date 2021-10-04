
import React from "react";
import {Provider} from 'react-redux'
import {Provider as PaperProvider} from 'react-native-paper'


import configureStore from "./src/store/configureStore";

import AppWrapper from "./AppWrapper";
import logger from './src/utilities/logger'
import {SafeAreaProvider} from 'react-native-safe-area-context'

logger.start()

export default function App() {
  const store = configureStore();

  return (
      <SafeAreaProvider>
        <Provider store={store}>
            <PaperProvider>
                <AppWrapper/>
            </PaperProvider>
        </Provider>
      </SafeAreaProvider>
  )
}


/*
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/
