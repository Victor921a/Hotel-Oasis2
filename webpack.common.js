const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pages = [
  'index',
  'login',
  'register',
  'personal',
  'reservations',
  'service',
  '404'
];

module.exports = {
  entry: {
    app: './src/js/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './js/app.js',
  },
  plugins: pages.map(page => new HtmlWebpackPlugin({
    template: `./src/${page}.html`,
    filename: `${page}.html`,
    inject: false, // Keep hardcoded css/js links in HTML files
  }))
};
