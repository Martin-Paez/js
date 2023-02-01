const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'public', 'A_mano_termometro', 'ImgThermWidget'),
  },
  plugins: [
    new NodemonPlugin()
  ],
};