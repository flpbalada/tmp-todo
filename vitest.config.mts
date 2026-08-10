import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

process.loadEnvFile();

const fromRoot = (path: string) =>
	fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
	resolve: {
		alias: [
			{ find: "server-only", replacement: fromRoot("./tests/server-only.ts") },
			{ find: "@payload-config", replacement: fromRoot("./payload.config.ts") },
			{ find: /^@\//, replacement: fromRoot("./") },
		],
	},
	test: {
		environment: "node",
		fileParallelism: false,
		hookTimeout: 30_000,
		include: ["tests/integration/**/*.test.ts"],
		testTimeout: 20_000,
	},
});
