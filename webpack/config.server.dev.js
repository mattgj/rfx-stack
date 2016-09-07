import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StartServerPlugin from 'start-server-webpack-plugin';
import path from 'path';

const Dir = global.DIR;

export function loader() {
  return {
    jsx: {
      query: {
        cacheDirectory: true,
        presets: [['es2015', { modules: false }], 'stage-0', 'react'],
        plugins: [
          'babel-root-import',
          'jsx-control-statements',
          'transform-decorators-legacy',
          'transform-class-properties',
          'transform-decorators',
        ],
      },
    },
    cssModules: {
      loader: ExtractTextPlugin.extract(
        'isomorphic-style-loader',
        ['css-loader?modules',
        'importLoaders=1',
        'localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader']
         .join('&')),
    },
    cssGlobal: {
      loader: ExtractTextPlugin.extract('isomorphic-style-loader', 'css-loader!postcss-loader'),
    },
  };
}

export function config(entry) {
  return {
    devtool: 'cheap-module-eval-source-map',
    entry: [
      'babel-polyfill',
      'whatwg-fetch',
      'webpack/hot/poll?1000',
      path.join(Dir.run, entry),
    ],
    output: {
      path: Dir.nodeBuild,
      filename: [entry, 'dev.bundle.js'].join('.'),
      chunkFilename: '[id].[hash:5]-[chunkhash:7].js',
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      libraryTarget: 'commonjs2',
    },
    externals: [
      /^[a-z\-0-9]+$/, { // Every non-relative module is external
        'socket.io': 'commonjs socket.io',
        'socket.io-client': 'commonjs socket.io-client',
        'socket.io-stream': 'commonjs socket.io-stream',
      },
    ],
    plugins: [
      new ExtractTextPlugin('style.css', { disable: true }),
      new StartServerPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoErrorsPlugin(),
    ],
  };
}