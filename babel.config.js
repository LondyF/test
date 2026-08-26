require('dotenv').config();

module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'transform-inline-environment-variables',
      {
        include: [
          'API_URL',
          'CLIENT_SECRET',
          'ENCRYPTION_KEY',
          'ENCRYPTION_VERSION',
          'ENCRYPTION_MAGIC',
        ],
      },
    ],
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
          '@features': './src/features',
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
    'react-native-worklets/plugin',
  ],
};
