import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ApplicationNavigator from '@/navigators/Application';

import './gesture-handler';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ApplicationNavigator />
    </SafeAreaProvider>
  );
}

export default App;
