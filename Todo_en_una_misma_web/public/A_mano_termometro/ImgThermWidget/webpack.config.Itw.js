const path = require('path');
//const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
  mode: 'development',
 // devtool: false,
  entry: {
    ImgThermWidget: './public/A_mano_termometro/ImgThermWidget/_ImgThermWidget.mjs'
  },
  output: {
    filename: '_ImgThermWidget.mjs',
    path: path.resolve(__dirname),
  },
 /* plugins: [
    new NodemonPlugin()
  ],*/
};
  