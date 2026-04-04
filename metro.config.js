// @ts-check
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

/**
 * Zustand's package.json "import" condition points to .mjs builds that use
 * `import.meta` (devtools checks). Metro's web output treats that as a script,
 * which throws "Cannot use import.meta outside a module". Node-style
 * resolution picks the CommonJS .js files instead — same runtime, web-safe.
 */
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "zustand" || moduleName.startsWith("zustand/")) {
    try {
      const filePath = require.resolve(moduleName, { paths: [__dirname] });
      return { type: "sourceFile", filePath };
    } catch {
      /* fall through to default */
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
