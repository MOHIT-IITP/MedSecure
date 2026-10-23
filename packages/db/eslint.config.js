const baseConfig = require("@medsecure/eslint-config");

module.exports = [
  ...baseConfig,
  {
    ignores: ["dist/**", "node_modules/**", "drizzle/**"],
  },
];
