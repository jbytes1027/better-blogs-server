module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-param-reassign": 0,
    "no-underscore-dangle": 0,
  },
}
