const config = {
  email: {
    domain: 'esports.betting',
    mailgun: {
      public: process.env.MAILGUN_PUBLIC,
      private: process.env.MAILGUN_PRIVATE
    },
    sendgrid: {
      apiKey: ''
    },
    from: {
      support: 'hello@esports.com',
    },
    template: {
      folder: 'default',
    }
  },
  app: {
    secret: 'asdf@#$23d234234dadasdfwewe23f4fsdsd',
    port: parseInt(process.env.BACKEND_PORT, 10) || 3001,
  },
  db: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    dialect: 'mysql',
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  },
  project: 'betting-backend',
  frontendBaseUrl: process.env.FRONTEND_BASE_URL,
  web3Provider: process.env.WEB3_PROVIDER || 'https://ropsten.infura.io/v3/608777ea4b3343e291b5ec70d42f2214',
  contractOwner: {
    matchTokenContractAddress: process.env.MATCH_TOKEN_CONTRACT_ADDRESS,
    bettingContractAddress: process.env.BETTING_CONTRACT_ADDRESS
  },
  decimals: 18,
  eventFromBlock: process.env.EVENT_FROM_BLOCK || 0,

  cronEventLogInterval: process.env.CRON_EVENT_LOG_INTERVAL || '*/10 * * * * *', // runs per 10 seconds
  cronTransactionConfirmInterval: process.env.CRON_TRANSACTION_CONFIRM_INTERVAL || '*/15 * * * *', // runs per 15 minutes

  lockPeriodMinutes: parseInt(process.env.LCOK_PERIOD_MINUTES, 10) || 0, /*7 * 24 * 60*/
};

module.exports = config;
