import { QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ApplicationNavigator from '@/navigators/Application';
import { queryClient } from '@/services/queryClient';
import { useUserStore } from '@/stores';

import './gesture-handler';
import './src/translations';

const App = (): React.ReactElement | null => {
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
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ApplicationNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
