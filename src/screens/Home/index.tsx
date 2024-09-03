import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize } from '@/theme';
import { Button, SafeAreaView } from '@/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from '@/types/navigation';

const Home = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.text}>Hello</Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  text: {
    ...fontSize.md,
    color: colors.text,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
