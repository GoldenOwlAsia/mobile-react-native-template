module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          // '@/components': './src/components',
          // '@/hooks': './src/hooks',
          // '@/navigators': './src/navigators',
          // '@/screens': './src/screens',
          // '@/services': './src/services',
          // '@/stores': './src/stores',
          // '@/theme': './src/theme',
          // '@/translations': './src/translations',
        },
      },
    ],
  ],
};
