import React, { memo } from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

import { border, colors, spacing, text } from '@/theme';

import Text from '../Text/Text';

type Props = TouchableOpacityProps & {
  text: string;
  textStyle?: TextStyle;
  style?: ViewStyle;
};

const Button = ({ text, textStyle, style, ...props }: Props) => {
  return (
    <TouchableOpacity {...props} style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default memo(Button);

const styles = StyleSheet.create({
  container: {
    padding: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.palette.primary400,
    borderRadius: border.radius,
  },
  text: {
    ...text.fontSize.md,
    color: colors.text,
  },
});
