const { defineConfig } = require("eslint/config");
const globals = require("globals");

module.exports = defineConfig([
    { files: ["**/*.js"], languageOptions: { globals: {...globals.node} } },
    {
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "warn",
        },
    },
]);
