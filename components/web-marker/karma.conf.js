module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [{ pattern: 'src/**/*.spec.ts', watched: false }],
    preprocessors: { 'src/**/*.spec.ts': ['webpack'] },
    reporters: ['coverage-istanbul', 'kjhtml'],
    coverageIstanbulReporter: {
      reports: [ 'html', 'text-summary' ],
      fixWebpackSourcePaths: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity,
    webpack: {
      mode: 'development',  devtool: 'inline-source-map',
      resolve: { extensions: ['.ts', '.js'] },
      module: { rules: [
        { test: /\.ts$/, use: { loader: 'ts-loader', options: { transpileOnly: true } } },
        { test: /\.ts$/,
          exclude: /(node_modules|\.spec\.ts$)/,
          loader: 'istanbul-instrumenter-loader',
          enforce: 'post',
          options: { esModules: true }
        },
        { test: /\.scss$/, use: [ 'style-loader',
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ]}
      ] },
    }
  })
}
