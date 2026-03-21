import 'react-native';
import type { ReactElement } from 'react';
import {
  render as rtlRender,
  type RenderOptions,
} from '@testing-library/react-native';

export * from '@testing-library/react-native';

function render<T>(ui: ReactElement<T>, options?: RenderOptions) {
  return rtlRender(ui, options);
}

export { render };
