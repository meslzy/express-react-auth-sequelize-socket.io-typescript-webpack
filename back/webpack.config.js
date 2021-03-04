const path = require("path");

const DefinePlugin = require("webpack").DefinePlugin;
const NodemonPlugin = require("nodemon-webpack-plugin");

const NodeExternals = require("webpack-node-externals");

module.exports = mode => {
	const dev = mode === "dev";

	console.log(`build for back with ${dev ? "development" : "production"} mode`);

	const definePlugin = new DefinePlugin({
		"process.env.NODE_ENV": JSON.stringify(dev ? "development" : "production"),
	});

	const nodemonPlugin = new NodemonPlugin();
	const nodeExternals = NodeExternals();

	return {
		target: "node",
		mode: dev ? "development" : "production",
		entry: path.join(__dirname, "index.ts"),
		output: {
			filename: "index.js",
			path: path.join(__dirname, "dist"),
		},
		resolve: {
			extensions: [".ts", ".js", ".json"],
		},
		module: {
			rules: [
				{
					test: /\.(js|ts)$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: [
								"@babel/preset-typescript",
								"@babel/preset-env",
							],
							plugins: [
								"@babel/plugin-proposal-class-properties",
								"@babel/plugin-transform-runtime",
							],
						},
					},
				}
			],
		},
		plugins: [definePlugin, nodemonPlugin],
		externals: [nodeExternals]
	};
};
