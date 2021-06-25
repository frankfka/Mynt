const withTM = require('next-transpile-modules')(['lowdb']);
const withAntdLess = require('next-plugin-antd-less');

module.exports = withTM(
  withAntdLess({
    // optional
    lessVarsFilePath: './styles/variables.less',
    webpack(config) {
      return config;
    },
  })
);
