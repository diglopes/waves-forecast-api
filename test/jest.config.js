/* eslint-disable */
const { resolve } = require("path");
const root = resolve(__dirname, "..");
const baseConfig = require(`${root}/jest.config`);

module.exports = {
  ...baseConfig,
  rootDir: root,
  displayName: "e2e-tests",
  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
  testMatch: ["<rootDir>/test/**/*.test.ts"],
};
