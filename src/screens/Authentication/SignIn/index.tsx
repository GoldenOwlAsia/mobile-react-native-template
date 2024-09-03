import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Button, SafeAreaView, Text, TextInput } from '@/components';
import { colors, fontSize, spacing } from '@/theme';
import { ApplicationStackParamList } from '@/types/navigation';

const SignIn = () => {
  const navigation =
    useNavigation<StackNavigationProp<ApplicationStackParamList>>();

  const onSubmit = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <View>
          <Text style={styles.subtitle}>Email</Text>
          <TextInput style={styles.emailInput} />
          <Text style={styles.subtitle}>Password</Text>
          <TextInput />
        </View>
        <Button text="Submit" style={styles.button} onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  title: {
    ...fontSize.xxl,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  subtitle: {
    ...fontSize.sm,
    color: colors.text,
  },
  emailInput: {
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.xl,
  },
});
