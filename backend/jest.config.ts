/** @type {import("@jest/types").Config.InitialOptions} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      useESM: true,
      tsconfig: "./tsconfig.jest.json"
    }]
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.spec.ts"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  rootDir: ".",
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true
};

module.exports = config; 