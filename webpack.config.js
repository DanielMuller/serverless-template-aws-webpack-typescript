/* eslint-disable */
'use strict'
const fs = require('fs')
const path = require('path')

const { DefinePlugin } = require('webpack')

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const slsw = require('serverless-webpack')

if (slsw.lib.webpack.isLocal) {
  console.log('Running locally')
}

module.exports = {
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  devtool: slsw.lib.webpack.isLocal ? 'source-map' : 'cheap-source-map',
  optimization: {
    minimize: true,
    mangleExports: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        include: /vendor/,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
      },
    },
  },
  externalsPresets: { node: true },
  externals: {
    'aws-sdk': 'aws-sdk',
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  stats: {
    modules: false,
    warnings: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      GLOBAL_VAR_SERVICE_NAME: JSON.stringify(slsw.lib.serverless.service.service),
      GLOBAL_VAR_NODE_ENV: JSON.stringify(process.env.STAGE || 'local'),
      GLOBAL_VAR_REGION: JSON.stringify(slsw.lib.options.region || 'us-east-2'),
      GLOBAL_VAR_STAGE: JSON.stringify(process.env.STAGE || 'local'),
      GLOBAL_VAR_IS_LOCAL: JSON.stringify(slsw.lib.webpack.isLocal),
    }),
  ],
}
