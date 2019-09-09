const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    port: process.env.PORT,
    database: process.env.VIDLY_DB,
    secretKey: process.env.JWT_PRIVATEKEY
}