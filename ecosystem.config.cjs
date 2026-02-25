module.exports = {
  apps: [
    {
      name: 'art-bank-server',
      script: 'npx',
      args: 'tsx watch server/_core/index.ts',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        ML_SERVICE_URL: 'http://localhost:5001'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s'
    },
    {
      name: 'ml-pricing-engine',
      script: 'python3',
      args: 'server/ml_pricing_engine.py',
      cwd: '/home/user/webapp',
      env: {
        PYTHONUNBUFFERED: '1',
        PORT: 5001
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
