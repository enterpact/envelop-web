 webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    common: [
      path.join(__dirname, 'assets', 'javascripts', 'common.js'),
      path.join(__dirname, 'assets', 'stylesheets', 'common.scss')
    ],
    download: [
      'babel-polyfill',
      path.join(__dirname, 'assets', 'javascripts', 'download.js'),
    ]
  },

  output: {
    path: path.join(__dirname, '.tmp', 'dist'),
    filename: 'javascripts/[name].js'
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'common.css',
            },
          },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['./node_modules']
            }
          },
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
        },
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
