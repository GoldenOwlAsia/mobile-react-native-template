/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react/jsx-filename-extension */
import 'react-native';
import React from 'react';
import { render as rtlRender } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, reducers } from '@/stores';

// re-export everything
export * from '@testing-library/react-native';

function render(ui, { initialState = {}, ...renderOptions } = {}) {
  const store = configureStore({
    reducer: reducers,
    preloadedState: initialState,
  });
  const Wrapper = ({ children }) => {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    );
  };
  return { ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }), store };
}

// override render method
export { render };
