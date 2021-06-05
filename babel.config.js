const getBaseConfig = require("./babel.config.base");

module.exports = api => {
  const isTest = api.env("test");
  if (!isTest) return {};

  const babel = getBaseConfig();

  return {
    presets: [
      [
        "babel-preset-packez",
        {
          modules: "cjs",
        },
      ],
    ],
    plugins: babel.plugins,
  };
};
