/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/types.ts", "!src/**/*.d.ts", "!src/**/index.ts"],
};
