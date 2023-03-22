/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, ScrollView } from 'react-native';
import { XButton, XText, XTextInput } from '../../components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks';

const ForgotPassword = () => {
  const { t } = useTranslation(['sign', 'welcome']);
  const { Fonts, Gutters, Layout } = useTheme();

  const [email, setEmail] = React.useState('');

  const onSubmit = () => {};
  const onEmailChange = (value: string) => setEmail(value);

  return (
    <ScrollView
      style={Layout.fill}
      contentContainerStyle={[
        Layout.fullSize,
        Layout.fill,
        Layout.colCenter,
        Layout.scrollSpaceBetween,
      ]}
    >
      <View
        style={[
          Layout.fill,
          Layout.fullWidth,
          Layout.justifyContentBetween,
          Layout.alignItemsStretch,
          Gutters.regularHPadding,
        ]}
      >
        <View>
          <View style={{ height: 40 }} />
          <XText style={[Fonts.titleRegular]}>
            {t('sign:forgot_password')}
          </XText>
          <View style={{ height: 100 }} />
          <XTextInput
            placeholder="Email"
            onChangeText={onEmailChange}
            value={email}
          />
          <View style={{ height: 40 }} />
          <XButton title={t('sign:next')} onPress={onSubmit} />
        </View>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;
