import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import {
  NativeSafeAreaViewProps,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { colors } from '@/theme';

type Props = NativeSafeAreaViewProps;

const CustomSafeAreaView = ({ children }: Props) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

export default memo(CustomSafeAreaView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
