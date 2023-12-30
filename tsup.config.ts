import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/worker.ts"],
	outDir: "dist",
	sourcemap: true,
	clean: true,
	shims: true,
	dts: true,
	format: ["cjs", "esm"],
});
