import React, { memo } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { colors, text } from '@/theme';

type Props = TextProps;

const CustomText = ({ style, ...props }: Props) => {
  return (
    <Text {...props} style={[styles.text, style]}>
      {props.children}
    </Text>
  );
};

export default memo(CustomText);

const styles = StyleSheet.create({
  text: {
    ...text.fontSize.md,
    color: colors.text,
  },
});
