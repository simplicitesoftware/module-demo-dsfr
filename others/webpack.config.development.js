const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'main-bundle.js',
		publicPath: 'auto'
	},
	devServer: {
		port: 3000
	},
	module: {
		rules: [
			{
				test: /\.less$/i,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader' },
					{ loader: 'less-loader' }
				]
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin( {
			'process.env.WEBPACK_APP_URL': JSON.stringify('https://demo.dev.simplicite.io')
		})
	]
};