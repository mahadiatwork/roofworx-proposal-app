import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Pin Turbopack root to this project (folder containing package.json / node_modules).
// Avoids mis-inference when the dev cwd or editor points at a subdirectory (e.g. `app/`).
const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: configDir,
  },
};

export default nextConfig;
