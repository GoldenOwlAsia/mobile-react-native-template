import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import { border, colors, fontSize, spacing } from '@/theme';
import { Button, SafeAreaView } from '@/components';
import { useUserStore } from '@/stores';

const Home = () => {
  const email = useUserStore(state => state.email);
  const logout = useUserStore(state => state.logout);
  const { t } = useTranslation(['example']);

  const onPress = () => {
    logout();
  };

  const onChangeLanguage = (lang: 'vi' | 'en') => {
    i18next.changeLanguage(lang).catch(() => {
      // Handle error here
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.text}>{t('helloUser', { name: email })}</Text>
        <TouchableOpacity
          style={styles.langBtn}
          onPress={() =>
            onChangeLanguage(i18next.language === 'vi' ? 'en' : 'vi')
          }>
          <Text>{`Change language: ${i18next.language}`}</Text>
        </TouchableOpacity>
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
  langBtn: {
    padding: spacing.sm,
    marginVertical: spacing.md,
    backgroundColor: colors.palette.angry100,
    borderRadius: border.radius,
  },
});
