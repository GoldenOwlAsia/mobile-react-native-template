import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import { border, colors, fontSize, spacing } from '@/theme';
import { Button, SafeAreaView } from '@/components';
import { emailSelector } from '@/stores/user/selector';
import { useDispatch } from '@/hooks';
import { logout } from '@/stores/user/reducer';

const Home = () => {
  const email = useSelector(emailSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation(['example']);

  const onPress = () => {
    dispatch(logout());
  };

  const onChangeLanguage = (lang: 'vi' | 'en') => {
    i18next.changeLanguage(lang);
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
