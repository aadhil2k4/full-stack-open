module.exports = {
	"languageOptions": {
	  "ecmaVersion": 2021,
	  "sourceType": "module",
	  "globals": {
		"commonjs": true,
		"node": true
	  }
	},
	"rules": {
	  'semi': [
		'error',
		'never'
	  ],
	  'eqeqeq': 'error',
	  'no-trailing-spaces': 'error',
	  'object-curly-spacing': [
		'error',
		'always'
	  ],
	  'arrow-spacing': [
		'error',
		{
		  'before': true,
		  'after': true
		}
	  ],
	  'no-console': 0
	}
  };