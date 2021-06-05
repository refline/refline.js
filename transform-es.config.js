const getBaseConfig = require("./babel.config.base");

module.exports = function () {
  const babel = getBaseConfig();

  return {
    babel: {
      plugins: babel.plugins,
      runtimeOptions: {
        helpers: false,
      },
    },
  };
};
