const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  chainWebpack: config => {
    config.module
      .rule("mjs")
      .test(/\.mjs$/)
      .type("javascript/auto")
      .include.add(/node_modules/)
  },
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
    ]
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'es',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
