const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
require('dotenv').config(); // load config .env
const glob = require('glob');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
};

const commonConfig = merge([
  {
    entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.build,
      filename: '[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack demo',
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          eslint: {
            // Fail only on errors
            failOnWarning: false,
            failOnError: true,

            // Toggle autofix
            fix: true,

            // Output to Jenkins compatible XML
            outputReport: {
              filePath: 'checkstyle.xml',
              formatter: require('eslint/lib/formatters/checkstyle'),
            },
          }
        }
      }),
    ],
  },
  parts.lintJavaScript({
    include: PATHS.app,
    options: {
      emitWarnings: true,
    },
  }),
  parts.lintCSS({ include: PATHS.app }),
]);

const productionConfig = merge([
  parts.extractCSS({
    use: ['css-loader', parts.autoprefix()],
  }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
  })
]);

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
]);

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
};
