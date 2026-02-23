module.exports = {
  apps: [
    {
      name: 'art-bank-server',
      script: 'npx',
      args: 'tsx watch server/_core/index.ts',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s'
    }
  ]
}
