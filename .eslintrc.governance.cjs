// ESLint Configuration for Code Governance
// Prevents monolithic files and enforces modular architecture

module.exports = {
  extends: ['./.eslintrc.js'],
  rules: {
    // File size limits
    'max-lines': [
      'error',
      {
        max: 400,
        skipBlankLines: true,
        skipComments: true
      }
    ],
    
    // Function complexity limits
    'max-lines-per-function': [
      'warn',
      {
        max: 50,
        skipBlankLines: true,
        skipComments: true
      }
    ],
    
    // Component complexity limits for React
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }
    ],
    
    // Enforce component separation
    'max-statements': ['warn', 20],
    'complexity': ['warn', 10],
    
    // Prevent deep nesting
    'max-depth': ['error', 4],
    'max-nested-callbacks': ['error', 3]
  },
  
  overrides: [
    {
      // Stricter rules for React components
      files: ['**/*.tsx', '**/*.jsx'],
      rules: {
        'max-lines': [
          'error',
          {
            max: 300,
            skipBlankLines: true,
            skipComments: true
          }
        ]
      }
    },
    
    {
      // More lenient for configuration files
      files: ['**/*.config.js', '**/*.config.ts', '**/vite.config.ts'],
      rules: {
        'max-lines': 'off'
      }
    }
  ]
};
