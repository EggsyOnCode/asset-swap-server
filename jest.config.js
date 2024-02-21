const { pathsToModuleNameMapper } = require('ts-jest');

/** @type {import('ts-jest').JestConfigWithTsJest} */
const { compilerOptions } = require('./tsconfig.json');
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
};
