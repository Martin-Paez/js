const path = require('path');
//const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
  mode: 'development',
  //devtool: false,
  entry: {
    MultiEvent:'./public/A_mano_termometro/ImgThermWidget/_MultiEvent.mjs'
  },
  output: {
    filename: '_MultiEvent.mjs',
    path: path.resolve(__dirname),
  },
  /*plugins: [
    new NodemonPlugin()
  ],*/
};