import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, SafeAreaView, Text, TextInput } from '@/components';
import { colors, fontSize, spacing } from '@/theme';
import { useDispatch } from '@/hooks';
import { login } from '@/stores/user/reducer';

const SignIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSubmit = () => {
    dispatch(login(email));
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <View>
          <Text style={styles.subtitle}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.emailInput}
          />
          <Text style={styles.subtitle}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
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
