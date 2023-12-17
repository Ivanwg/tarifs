const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const FontminPlugin = require('fontmin-webpack');

const isDev = process.env.NODE_ENV === 'development';
const filename = extension => isDev ? `[name].${extension}` : `[name].[hash].${extension}`;

module.exports = {
  entry: [
    '@babel/polyfill',
    path.resolve(__dirname, 'src/index.js'),
  ],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  devtool: isDev ? 'eval' : false,
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 9000,
    historyApiFallback: isDev,
    hot: isDev,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/php/sendmail.php",
          to() {
            return "php/[name][ext]";
          },
          noErrorOnMissing: true,
        },
        {
          from: "src/php/PHPMailer/*.php",
          to() {
            return "php/PHPMailer/[name][ext]";
          },
          noErrorOnMissing: true,
        },
      ]
    }),
  ].concat(isDev ? [] : [
    new MiniCssExtractPlugin({
      filename: 'css/' + filename('css'),
    }),
    new FontminPlugin({
      autodetect: true,
    }),
  ]),
  optimization: {
    runtimeChunk: 'single',
    minimize: !isDev,
    minimizer: [
      `...`,
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              url: {
                filter: (url, resourcePath) => {
                  if (url.includes(".png") || url.includes(".jpg")) {
                    return false;
                  }
                  return true;
                },
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: "$env: " + process.env.NODE_ENV + ";",
              sourceMap: isDev,
            },
          },
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]',
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|svg|ico)$/i,
        type: 'asset/resource',
        use: [].concat(isDev ? [] : [{
          loader: ImageMinimizerPlugin.loader,
          options: {
            minimizer: {
              implementation: ImageMinimizerPlugin.imageminMinify,
              options: {
                plugins: [
                  'imagemin-jpegtran',
                  'imagemin-optipng',
                  'imagemin-svgo',
                ],
              },
            },
          },
        }]),
        generator: {
          filename: 'img/[name][ext]'
        }
      },
      {
        test: /(manifest.json|browserconfig.xml|favicon.ico)/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]'
        }
      },
    ]
  },
}

