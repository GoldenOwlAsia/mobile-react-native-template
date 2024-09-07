import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { colors, fontSize } from '@/theme';
import { Button, SafeAreaView } from '@/components';
import { emailSelector } from '@/stores/user/selector';
import { useDispatch } from '@/hooks';
import { logout } from '@/stores/user/reducer';

const Home = () => {
  const email = useSelector(emailSelector);
  const dispatch = useDispatch();

  const onPress = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.text}>Hello {email}</Text>
        <Button text="Logout" onPress={onPress} />
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
    justifyContent: 'center',
  },
});
