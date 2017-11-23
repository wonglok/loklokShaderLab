var webpack = require('webpack')

module.exports = function ({ entryBase, outputBase, minify, fastMini }) {
  var result = {
    entry: entryBase + '/main.js',
    output: {
      path: outputBase,
      // path: path.resolve(__dirname, './dist'),
      publicPath: outputBase,
      filename: 'build.js'
    },
    module: {
      rules: [
        // {
        //   test: /\.vue$/,
        //   loader: 'vue-loader',
        //   options: {
        //     loaders: {
        //       // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
        //       // the "scss" and "sass" values for the lang attribute to the right configs here.
        //       // other preprocessors should work out of the box, no loader config like this necessary.
        //       'scss': 'vue-style-loader!css-loader!sass-loader',
        //       'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
        //     }
        //     // other vue-loader options go here
        //   }
        // },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          },
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        },
        {
          test: /\.(frag|vert)$/,
          loader: 'raw-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    },
    resolve: {
      alias: {
        // 'vue$': 'vue/dist/vue.esm.js',
        '@': entryBase
      }
    },
    devServer: {
      historyApiFallback: true,
      noInfo: true,
      overlay: true
    },
    performance: {
      hints: false
    },
    devtool: '#eval-source-map'
  }

  if (minify) {
    result.devtool = '#source-map'
    result.plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    ]
  }

  if (fastMini) {
    result.devtool = '#cheap-source-map'
    result.plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      })
    ]
  }

  return result
}
