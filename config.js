const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    port: process.env.PORT,
    database: (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'production') ? process.env.VIDLY_DB : process.env.DB_TEST_URL,
    secretKey: process.env.JWT_PRIVATEKEY,
}