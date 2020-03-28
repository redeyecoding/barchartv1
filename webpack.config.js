const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
module: {
    rules: [
    {
        test: /\.s[ac]ss$/i,
        use: ['style-loader',
              'css-loader',
              'sass-loader'
            ],
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
      }
    },
    ],
},
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [new HtmlWebpackPlugin({
    filename: 'index.html', 
    template: './src/js/index.html' 
})],
devServer: {
    contentBase: path.join(__dirname, './build'),
    compress: true,
    port: 9000
  }, 

};