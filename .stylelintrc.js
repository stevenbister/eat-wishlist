/** @type {import('stylelint').Config} */
export default {
	extends: ['stylelint-config-standard-scss', 'stylelint-config-idiomatic-order'],
	rules: {
		'custom-property-pattern': null,
		'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: 'global' }],
		'color-named': 'never',
		'no-descending-specificity': true,
		'no-duplicate-selectors': true
	},
	customSyntax: 'postcss-html'
};
