const path = require("path");

const src = path.join(__dirname, "src");
const dist = path.join(__dirname, "dist");

const DefinePlugin = require("webpack").DefinePlugin;
const HtmlPlugin = require("html-webpack-plugin");

module.exports = mode => {
	const dev = mode === "dev";

	console.log(`build for front with ${dev ? "development" : "production"} mode`);

	const definePlugin = new DefinePlugin({
		"process.env.NODE_ENV": JSON.stringify(dev ? "development" : "production"),
	});
	const htmlPlugin = new HtmlPlugin({
		filename: path.join(dist, "index.html"),
		template: path.join(src, "index.html"),
		cache: true,
	});

	return {
		target: "web",
		mode: dev ? "development" : "production",
		entry: path.join(src, "index.tsx"),
		output: {
			filename: "index.js",
			path: dist,
			publicPath: "/"
		},
		resolve: {
			extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".scss"]
		},
		module: {
			rules: [
				{
					test: /\.(scss|css)$/,
					use: [
						"style-loader",
						"css-loader",
						"sass-loader",
					],
				},
				{
					test: /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg)$/,
					use: [{loader: "url-loader?limit=100000"}],
				},
				{
					test: /\.(js|jsx|ts|tsx)$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: [
								"@babel/preset-typescript",
								"@babel/preset-react",
								"@babel/preset-env",
							],
							plugins: [
								"@babel/plugin-proposal-class-properties",
								"@babel/plugin-transform-runtime",
							],
						},
					},
				},
			],
		},
		devServer: {
			contentBase: dist,
			compress: true,
			hot: true,
			port: 3000,
			historyApiFallback: true,
		},
		performance: {
			hints: false,
		},
		plugins: [definePlugin, htmlPlugin]
	};
};
