const expoConfig = require("eslint-config-expo/flat");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  ...expoConfig,
  {
    rules: {
      "no-console": "warn",
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*", "ios/*", "android/*"],
  },
]);
