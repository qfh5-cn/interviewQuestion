const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWepackPlugin = require("clean-webpack-plugin");

//const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
// const TerserPlugin = require("terser-webpack-plugin");

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// console.log('webpack:',process.argv)
const env = process.argv[2].slice(2);console.log(env)

// 导出webpack配置
module.exports = {
  mode: env,
  // 入口
  entry: "./src/main.js",

  // 出口
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "js/[name]-[hash:5].js",
    publicPath:'/'
  },

  // 服务器
  devServer: {
    contentBase: path.join(__dirname, "./src"),
    host: "0.0.0.0",
    compress:true,
    hot:true
  },

  resolve: {
    alias: {
      "@": path.resolve("./src"),
      "@@": path.resolve("./src/components"),
      "~": path.resolve("./src/pages")
    }
  },

  // optimization: {
  //   minimizer: [
  //     //   new UglifyJSPlugin({
  //     //     uglifyOptions: {
  //     //       output: {
  //     //         comments: false
  //     //       },
  //     //       compress: {
  //     //         warnings: false,
  //     //         drop_debugger: true,
  //     //         drop_console: true
  //     //       }
  //     //     }
  //     //   }),
  //     new TerserPlugin({
  //       cache: true,
  //       parallel: true,
  //       sourceMap: true, // Must be set to true if using source-maps in production
  //       terserOptions: {
  //         // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
  //       }
  //     })
  //   ],
  //   runtimeChunk: {
  //     name: "runtime"
  //   }
  // },

  // 加载器
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, "./node_modules"), //排除node_modules目录

        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/react"],
              plugins: [
                //'lodash', //lodash优化（无用）
                "@babel/plugin-syntax-dynamic-import",
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                "@babel/plugin-proposal-class-properties",
                [
                  "import",
                  {
                    libraryName: "antd",
                    libraryDirectory: "es",
                    style: "css"
                  }
                ] // `style: true` 会加载 less 文件
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        loader: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        loader: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },

  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      hash: true,
      title: "首页"
    }),
    new CleanWepackPlugin(),

    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),

    // new BundleAnalyzerPlugin(),

    // 优化打包文件体积
    // 1.压缩js代码
    // new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    // 2.提取公共部分
    // new webpack.optimize.CommonsChunkPlugin({
    //     names: ['vendor'],
    //     filename: 'js/[name].js',
    //     minChunks: Infinity
    // }),

    // 3.定义全局变量
    new webpack.DefinePlugin({
      // 注入到客户端全局变量，必须使用JSON.stringify()
      "process.env": {
        NODE_ENV: JSON.stringify(env)
      }
    })
  ]
};
