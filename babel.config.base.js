const pkg = require("./package.json");
module.exports = function () {
  return {
    plugins: [
      "babel-plugin-lodash",
      [
        "babel-plugin-transform-define",
        {
          __VERSION__: pkg.version,
        },
      ],
      [
        "babel-plugin-module-resolver",
        {
          // root: ["./src"], // 仅限./src目录
          alias: {
            "~": "./src",
          },
        },
      ],
      [
        "babel-plugin-search-and-replace",
        {
          rules: [
            {
              search: "%VERSION%",
              replace: pkg.version,
            },
          ],
        },
      ],
    ],
  };
};
