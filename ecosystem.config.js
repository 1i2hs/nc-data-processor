module.exports = {
  apps: {
    script: 'src/app.js',
    watch: 'src',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  },
};
