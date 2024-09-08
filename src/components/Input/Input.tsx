import React, { memo } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { border, colors, spacing } from '@/theme';

type Props = TextInputProps;

const Input = ({ style, ...props }: Props) => {
  return <TextInput {...props} style={[styles.input, style]} />;
};

export default memo(Input);

const styles = StyleSheet.create({
  input: {
    borderWidth: border.width,
    borderColor: colors.border,
    padding: spacing.xs,
    borderRadius: border.radius,
  },
});
