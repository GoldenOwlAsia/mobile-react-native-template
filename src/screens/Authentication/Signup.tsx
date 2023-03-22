/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { XButton, XText, XTextInput } from '../../components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks';
import { ApplicationScreenProps } from 'mobile-react-native-template/@types/navigation';

const Signup = ({ navigation }: ApplicationScreenProps) => {
  const { t } = useTranslation(['sign', 'welcome']);
  const { Common, Fonts, Gutters, Layout } = useTheme();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPasswrord] = React.useState('');

  const onSignup = () => {};
  const onEmailChange = (value: string) => setEmail(value);
  const onNameChange = (value: string) => setName(value);
  const onPasswordChange = (value: string) => setPasswrord(value);

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
          <XText style={[Fonts.titleRegular]}>{t('sign:signup')}</XText>
          <View style={{ height: 100 }} />
          <XTextInput
            placeholder={t('sign:username')}
            onChangeText={onNameChange}
            value={name}
          />
          <XTextInput
            placeholder={t('sign:email')}
            onChangeText={onEmailChange}
            value={email}
          />
          <XTextInput
            secureTextEntry
            placeholder={t('sign:password')}
            onChangeText={onPasswordChange}
            value={password}
          />
          <View style={{ height: 40 }} />
          <XButton title={t('sign:next')} onPress={onSignup} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.pop()}
            style={[Common.button.text]}
          >
            <XText style={Fonts.textSmall}>
              {t('sign:already_have_account')}
            </XText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signup;
