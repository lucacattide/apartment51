'use strict';
let webpack = require('webpack');
const path = require('path');
module.exports = {
  entry: [
    './js/lib/bootstrap.min.js',
    './js/lib/modernizr-custom.js',
    './js/lib/aframe.min.js',
    './js/lib/owl.carousel.min.js',
    './js/dist/main.js',
  ],
  output: {
    path: path.resolve(__dirname + 'js/dist'),
    filename: 'bundle.js',
    publicPath: '/js/dist/',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
};
