module.exports = function ({}) {
  return {
    port: process.env.PORT || 8080,
    devMiddleware: {
      writeToDisk: true,
    },
  };
};
