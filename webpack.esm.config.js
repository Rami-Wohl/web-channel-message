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
		filename: "index.mjs",
		path: path.resolve(__dirname, "dist", "esm"),
		libraryTarget: "module",
		publicPath: "/dist/esm/",
	},
	experiments: {
		outputModule: true,
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
