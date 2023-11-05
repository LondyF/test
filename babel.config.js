module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module:react-native-dotenv'],
    'transform-inline-environment-variables',
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx',
        ],
        alias: {
          '@src': './src/',
          '@navigations': './src/navigations',
          '@components': './src/components',
          '@assets': './src/assets',
          '@styles': './src/styles',
          '@utils': './src/utils',
          '@helpers': './src/helpers',
          '@stores': './src/stores',
          '@services': './src/services',
          '@hooks': './src/hooks',
        },
      },
    ],
    [
      'babel-plugin-rewrite-require',
      {
        aliases: {
          stream: 'readable-stream',
        },
      },
    ],
  ],
};
