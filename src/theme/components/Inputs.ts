import { StyleSheet } from 'react-native';
import { CommonParams } from '../../../@types/theme';

export default function <C>({ Colors, Gutters, Layout }: CommonParams<C>) {
  const base = {
    ...Layout.center,
    ...Gutters.regularHPadding,
    backgroundColor: Colors.inputBackground,
    height: 40,
    width: '100%',
    marginTop: 8,
    color: Colors.inputText,
  };

  return StyleSheet.create({
    base,
    outline: {
      ...base,
      borderColor: Colors.inputBorder,
      borderWidth: 0.5,
    },
  });
}
