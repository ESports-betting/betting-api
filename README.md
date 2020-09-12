# ESports Betting API

### Setup
Install nodejs and mysql.

Create database
```
node_modules/.bin/sequelize db:create
```

Migrate db to the running service
```
npm run migrate
```

Install pm2:
```
sudo npm install -g pm2
```

Ubuntu only:
```
sudo apt update
sudo apt install build-essential
cp /etc/ssl/private/ssl-cert-snakeoil.key config/cert/backend.key
sudo cp /etc/ssl/private/ssl-cert-snakeoil.key config/cert/backend.key
```

Set the following variables in a file called `.env` at the project root:
```
MYSQL_HOST=
MYSQL_DATABASE=
MYSQL_USERNAME=
MYSQL_PASSWORD=
MAILGUN_PUBLIC=
MAILGUN_PRIVATE=
FRONTEND_BASE_URL=
MATCH_TOKEN_CONTRACT_ADDRESS=
BETTING_CONTRACT_ADDRESS=
EVENT_FROM_BLOCK=
```

Start the server:
```
# Staging
sudo pm2 start --env staging pm2.json

# Production
sudo pm2 start --env production pm2.json
```

Restart the server:

```
sudo pm2 restart betting-api
```