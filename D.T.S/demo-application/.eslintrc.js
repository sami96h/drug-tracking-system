module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'prettier'
	],
	overrides: [
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	plugins: [
		'prettier'
	],
	rules: {
		indent: [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		quotes: [
			'error',
			'single'
		],
		semi: [
			'error',
			'never'
		],
		'no-multiple-empty-lines': ['error']
		,
		strict: ['error', 'never']
	}
}
