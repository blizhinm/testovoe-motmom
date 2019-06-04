const path = require('path');

module.exports = {
	mode: 'development',
	entry: './public/src/js/app.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public/dist')
	},
	module: {
		rules: [
			{test: /\.handlebars$/, loader: 'handlebars-loader'}
		]
	}
};