import { ThemeVariables } from '../../@types/theme';

export default function ({}: ThemeVariables) {
  return {
    logo: require('./assets/images/tom_light.png'),
    icons: {
      colors: require('./assets/images/colorswatch.png'),
      send: require('./assets/images/send.png'),
      account: require('./assets/images/ic-account.png'),
      translate: require('./assets/images/translate.png'),
      apple: require('./assets/images/ic-apple.png'),
      google: require('./assets/images/ic-google.png'),
      facebook: require('./assets/images/ic-facebook.png'),
    },
  };
}
