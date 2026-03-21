import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ApplicationNavigator from '@/navigators/Application';
import { useUserStore } from '@/stores';

import './gesture-handler';
import './src/translations';

function App(): React.ReactElement | null {
  const [hydrated, setHydrated] = useState(() =>
    useUserStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (useUserStore.persist.hasHydrated()) {
      setHydrated(true);
      return undefined;
    }
    return useUserStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ApplicationNavigator />
    </SafeAreaProvider>
  );
}

export default App;
