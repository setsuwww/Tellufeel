import js from "@eslint/js";
import globals from "globals";
import vue from "eslint-plugin-vue";

export default [
    {
        ignores: [
            "dist/",
            "coverage/",
            "node_modules/",
        ],
    },

    js.configs.recommended,

    ...vue.configs["flat/recommended"],

    {
        files: [
            "**/*.js",
            "**/*.vue",
        ],

        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },

        rules: {
            "no-console": "warn",
            "no-debugger": "error",
        },
    },

    {
        files: [
            "cypress/**/*.js",
        ],

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.mocha,

                cy: "readonly",
                Cypress: "readonly",
                expect: "readonly",
            },
        },
    },

    {
        files: [
            "cypress.config.js",
        ],

        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
];
