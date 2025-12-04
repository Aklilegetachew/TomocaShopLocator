module.exports = {
  apps: [
    {
      name: "tomoca-app",
      script: "npm",
      args: "run start",
      cwd: "/home/aklile/TomocaShopLocator",
      watch: false,
      env: {
        NODE_ENV: "production",
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
        WEBHOOK_DOMAIN: process.env.WEBHOOK_DOMAIN,
        PORT: process.env.PORT || 2000,
        DATABASE_URL: process.env.DATABASE_URL,
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
      },
    },
  ],
}
