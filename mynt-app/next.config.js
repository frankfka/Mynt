const withTM = require('next-transpile-modules')(['lowdb']);

module.exports = withTM({
  reactStrictMode: true,
});
