const baseConfig = require("@medsecure/eslint-config");

module.exports = [
  ...baseConfig,
  {
    ignores: [".next/**", "dist/**", "node_modules/**"],
  },
];
