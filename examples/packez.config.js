"use strict";

module.exports = function (options, state) {
  return {
    /**
     * @param {"development" | "production"}
     */
    // mode: options.mode,

    /**
     * 项目目录，如果设置则只处理项目目录的文件
     * @param {string[]}
     */
    // include: [],
    // exclude: [],

    /**
     * 同webpack的entry
     * @param {string | string[]}
     */
    // entry: "./src/index.js"

    /**
     * 打包后的输出目录
     * @param {string}
     */
    // outputDir: 'dist',

    /**
     * 参考webpack的publicPath
     * @param {string}
     */
    // publicPath: "",

    /**
     * 项目预加载的polyfills文件
     * @param {string | string[]}
     */
    // polyfills: require.resolve('packez/lib/polyfills'),

    /**
     * 是否同时生成entry对应的html文件
     * @param {boolean}
     */
    // shouldUseEntryHTML: true,

    /**
     * 生成sourcemap文件，对prod模式生效
     * @param {boolean}
     */
    // shouldUseSourceMap: false,

    /**
     * 如不设置，查找tsconfig.js是否存在当作判断依据
     */
    // useTypeScript: false,

    /**
     * 样式文件是否存储成单独的文件 true: 不生成 fasle:生成
     * @param {boolean}
     */
    // inlineStyle: false,

    /**
     * 打包前清除outputDir文件里的内容
     */
    // clean: true,

    /**
     * 自定义webpack加载器, 同webpack的modules
     * @example
     * {
     *      test: /\.m?js$/,
     *      use: [...]
     * }
     */
    // loaders: [],

    /**
     * babel 配置参数
     */
    //babel: {},
    //postcss plugins
    // postcss:[],

    /**
     * eslint 配置参数
     */
    //eslint: {},

    /**
     * 自定义webpack加载器
     * enforce: "pre"
     */
    // preLoaders: [],
    // webpack扩展插件
    // plugins: [],

    /**
     * 输出文件命名规则
     * 如不设置dev模式下默认没有contenthash:8
     */
    // assets: {
    //     css: {
    //         name: "[name].[contenthash:8].css",
    //         chunkName: "[name].[chunkhash:8].chunk.css",
    //         output: "static/css"
    //     },
    //     js: {
    //         name: "[name].[chunkhash:8].js",
    //         chunkName: "[name].[chunkhash:8].chunk.js",
    //         output: "static/js"
    //     },
    //     media: {
    //         regexp: /\.(?:png|jpe?g|gif|bmp)$/,
    //         name: "[name].[hash:8].[ext]",
    //         output: "static/media",
    //         limit: 10000
    //     }
    // },
    // 初始化时有效，后期需要修改则修改package.json里的browserslist
    // browserslist: [
    //     ">=0.2%",
    //     "not dead",
    //     "not op_mini all",
    //     "not Android 4.4.3-4.4.4",
    //     "not ios_saf < 10",
    //     "not Chrome < 50",
    //     "firefox ESR"
    // ],
    // webpack options
    // optimization: {
    //     splitChunks: {
    //         chunks: "all",
    //         name: false
    //     }
    // },
    // target: "web",
    // resolve: {},
    // externals: {},
    // performance: false,
    devServer: {
      host: "0.0.0.0",
      clientLogLevel: "none",
      quiet: true,
      watchContentBase: true,
      hot: false,
      overlay: false,
      compress: true,
      port: 9020,
      publicPath: "/",
    },
    // node: {
    //     module: "empty",
    //     dgram: "empty",
    //     dns: "mock",
    //     fs: "empty",
    //     net: "empty",
    //     tls: "empty",
    //     child_process: "empty"
    // }
    // 监控源文件
    // watch: false,
    // watchOptions: {
    //     aggregateTimeout: 300,
    //     poll: undefined
    // },
  };
};
