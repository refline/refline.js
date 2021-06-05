const getBaseConfig = require("./babel.config.base");

module.exports = function (options, state) {
  const babel = getBaseConfig();

  return {
    useTypeScript: false,
    babel: {
      plugins: babel.plugins,
    },
    eslint: {
      rules: {
        "react-hooks/rules-of-hooks": "warn",
      },
    },
  };
};
