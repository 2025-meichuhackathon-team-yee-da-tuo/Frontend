const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: 'all',
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    },
    hot: true,
    liveReload: true,
    proxy: {
      '/api': {
        target: 'http://203.116.30.132:8000',
        changeOrigin: true,
        secure: false
      }
    }
    },
});

