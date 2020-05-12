module.exports = {
//  preset: 'ts-jest',
//  "roots": [
//    "<rootDir>/src"
//  ],
  "testMatch": [
    "**/tests/**/*.+(ts|tsx|js)",
//    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
  "globals": {
    "ts-jest": {
      "tsConfig": "tsconfig.json"
    }
  }
}
