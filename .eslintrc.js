const standardRestrictedGlobals = require('eslint-restricted-globals');

const noRestrictedGlobals = ["error", "isNaN", "isFinite"].concat(
  standardRestrictedGlobals
);
const noRestrictedGlobalsWorker = noRestrictedGlobals.filter(o => o !== 'self');

module.exports = {
  "ignorePatterns": ["dist", "node_modules"],
  "rules": {
    "prefer-template": "off",
    "no-var": 1,
    "no-unused-vars": 1,
    "camelcase": 1,
    "no-nested-ternary": 1,
    "no-console": 1,
    "no-template-curly-in-string": 1,
    "no-self-compare": 1,
    "import/prefer-default-export": 0,
    "arrow-body-style": 1,
    "import/no-extraneous-dependencies": ["off", { "devDependencies": false }],
    "no-restricted-globals": noRestrictedGlobals,
  },
  "overrides": [
    {
      "files": ["*.worker.js"],
      "rules": {
        "no-restricted-globals": noRestrictedGlobalsWorker
      }
    }
  ],
  "env": {
    "browser": true,
    "es6": true,
    "jest": true,
    "worker": true,
    "serviceworker": true
  },
  "extends": ["eslint:recommended", "airbnb-base", "prettier"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 11,
    "sourceType": "module"
  },
  "plugins": ["prettier"],
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": "config/webpack.common.js"
      }
    }
  }
}