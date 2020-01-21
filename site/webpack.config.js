const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const sass = require('node-sass')
const path = require('path')

const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'

module.exports = {
	entry: {
		bundle: ['./src/main.js'],
	},
	resolve: {
		extensions: ['.mjs', '.js', '.svelte'],
		alias: {
			src: path.resolve(__dirname, 'src/'),
		}
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js',
	},
	devServer: {
		historyApiFallback: true,
		contentBase: path.join(__dirname, 'public'),
		compress: true,
		port: 3001,
		open: true,
		overlay: {
			warnings: false,
			errors: true,
		},
	},
	module: {
		rules: [
			{
				test: /\.(html|svelte)$/,
				exclude: /node_modules\/(?!(svelte-routing)\/).*/,
				use: {
					loader:  prod ? 'svelte-loader': 'svelte-loader-hot',
					options: {
						emitCss: true,
						hotReload: true,
						preprocess: {
							style: ({content, attributes}) => {
								if (attributes.type !== 'text/scss') return

								return new Promise((resolve, reject) => {
									sass.render({
										data: content,
										includePaths: ['src'],
										sourceMap: true,
										outFile: 'x', // this is necessary, but is ignored
									}, (err, result) => {
										if (err) return reject(err)

										resolve({
											code: result.css.toString(),
											map: result.map.toString(),
											dependencies: ['src/scss/_theme-mixin.scss',
												'src/scss/_variables.scss'],
										})
									})
								})
							},
						},
					},
				},
			},
			{
				test: /\.scss$/,
				use: [
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader',
					'sass-loader?sourceMap'],
				// use: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader?sourceMap'],
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader',
				],
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: ['file-loader'],
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts/'
					}
				}]
			},
		],
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
	],
	devtool: prod ? false : 'source-map',
}
