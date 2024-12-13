// Installed Utils
import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
// Create Next Jest instance
const createJestConfig = nextJest({
  dir: './',
})

// Prepare the configuration for jest
const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/build/', '/public/'],
  testEnvironment: 'jsdom'
};

export default createJestConfig(config);