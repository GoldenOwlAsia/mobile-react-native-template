/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { XButton, XText, XTextInput } from '../../components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks';
import { ApplicationScreenProps } from 'mobile-react-native-template/@types/navigation';

const Signin = ({ navigation }: ApplicationScreenProps) => {
  const { t } = useTranslation(['sign', 'welcome']);
  const { Common, Fonts, Gutters, Layout, Images } = useTheme();

  const [email, setEmail] = React.useState('');
  const [password, setPasswrord] = React.useState('');

  const onLoginWithEmail = () => {};
  const onLoginWithFacebook = () => {};
  const onLoginWithGoogle = () => {};
  const onLoginWithApple = () => {};
  const onEmailChange = (value: string) => setEmail(value);
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
          <XText style={[Fonts.titleRegular]}>{t('sign:signin')}</XText>
          <View style={{ height: 100 }} />
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
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.push('Sign', {
                screen: 'ForgotPassword',
              })
            }
            style={[Common.button.text]}
          >
            <XText style={Fonts.textSmall}>
              {t('sign:forgot_password_button')}
            </XText>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
          <XButton title={t('sign:next')} onPress={onLoginWithEmail} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.push('Sign', {
                screen: 'Signup',
              })
            }
            style={[Common.button.text, Layout.center]}
          >
            <XText style={Fonts.textSmall}>{t('sign:no_have_account')}</XText>
          </TouchableOpacity>
        </View>

        <View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Layout.fullWidth,
            Gutters.smallTMargin,
          ]}
        >
          <TouchableOpacity
            style={[Common.button.circle, Gutters.regularBMargin]}
            onPress={() => onLoginWithApple()}
          >
            <Image source={Images.icons.apple} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[Common.button.circle, Gutters.regularBMargin]}
            onPress={() => onLoginWithFacebook()}
          >
            <Image source={Images.icons.facebook} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[Common.button.circle, Gutters.regularBMargin]}
            onPress={() => onLoginWithGoogle()}
          >
            <Image source={Images.icons.google} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signin;
