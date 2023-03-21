<div align="center">
    <img src="resources/tom-github-banner.png" alt="Logo" width="100%">
</div>

# React Native boilerplate

This project is a [React Native](https://facebook.github.io/react-native/) boilerplate that can be used to kickstart a mobile application. Fork from [TheCodingMachine](https://thecodingmachine.github.io/react-native-boilerplate/docs/Introduction/)

## Requirements

- Node 14 or greater is required. Development for iOS requires a Mac and Xcode 10 or up, and will target iOS 11 and up.

- You also need to install the dependencies required by React Native.  
Go to the [React Native environment setup](https://reactnative.dev/docs/environment-setup), then select `React Native CLI Quickstart` tab.  
Follow instructions for your given `development OS` and `target OS`.

## Quick start

To create a new project using the boilerplate simply run :

```
git clone git@github.com:GoldenOwlAsia/mobile-react-native-template.git
```

Assuming you have all the requirements installed, you can run the project by running:

- `yarn start` to start the metro bundler, in a dedicated terminal
- `yarn <platform>` to run the *platform* application (remember to start a simulator or connect a device)

## Content 🧳
The boilerplate contains a clear directory layout to provide a base architecture for your application with some essential dependencies:

- `React Native` (v0.71.4) application (in "ejected" mode to allow using dependencies that rely on native code)
- `Redux` (v^8.0.5) to help manage state
- `Redux Toolkit` (Query) (v^1.9.3) to improve redux api calls
- `Redux Persist` (v^6.0.0) to persist the Redux state
- `React Native mmkv` (v^2.6.2) which is an efficient, small mobile key-value storage
- `React Navigation` (v^6.1.6) to handle routing and navigation in the app, with a splash screen setup by default
- `React I18Next` (v^12.2.0) to handle internationalization in your app
- `prettier` and `eslint` preconfigured for React Native
- `react-native-flipper` (v^0.182.0) to debug react-native, `redux-flipper` (v^2.0.2) to debug redux, `navigation devtool` (v^6.0.18) to debug navigation,

The boilerplate includes an example (displaying fake user data) from UI components to the business logic. The example is easy to remove so that it doesn't get in the way.

## Directory layout 🗂️
- `src/components`: presentational components
- `src/hooks`: hooks of the app, you will have the useTheme hook to access the theme
- `src/navigators`: react navigation navigators
- `src/screens`: container components, i.e. the application's screens
- `src/services`: application services, e.g. API clients
- `src/stores`: redux actions, reducers and stores
- `src/theme`: base styles for the application
- `src/translations`: application strings, you can add languages files and be able to translate your app strings

## Digging Deeper

To learn more about this boilerplate, go to [TheCodingMachine documentation](https://thecodingmachine.github.io/react-native-boilerplate)