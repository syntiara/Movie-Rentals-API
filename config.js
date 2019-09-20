const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    port: process.env.PORT,
    database: process.env.NODE_ENV == 'development' ? process.env.VIDLY_DB_DEV : (process.env.NODE_ENV == 'production' ? process.env.VIDLY_DB_PROD: process.env.VIDLY_DB_TEST),
    secretKey: process.env.JWT_PRIVATEKEY,
}