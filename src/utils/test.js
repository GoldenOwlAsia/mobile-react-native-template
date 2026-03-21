/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react/jsx-filename-extension */
import 'react-native';
import React from 'react';
import { render as rtlRender } from '@testing-library/react-native';

// re-export everything
export * from '@testing-library/react-native';

function render(ui, { ...renderOptions } = {}) {
  return rtlRender(ui, renderOptions);
}

// override render method
export { render };
