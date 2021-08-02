/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
	// The test environment that will be used for testing
	testEnvironment: 'jsdom',

	// A map from regular expressions to paths to transformers
	transform: {
		'^.+\\.(j|t)sx?$': 'esbuild-jest',
	},
};
