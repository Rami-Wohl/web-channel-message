// @ts-check
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
	mode: "production",
	entry: "./src/index.ts",
	devtool: "inline-source-map",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist", "cjs"),
		libraryTarget: "commonjs",
		publicPath: "/dist/cjs/",
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
};

export default config;
