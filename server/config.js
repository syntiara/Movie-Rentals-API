import { config } from "dotenv";
config();

export const port = process.env.PORT;
export const database = process.env.NODE_ENV === 'development' ? process.env.VIDLY_DB_DEV : ( process.env.NODE_ENV === 'production' ? process.env.VIDLY_DB_PROD : process.env.VIDLY_DB_TEST );
export const secretKey = process.env.JWT_PRIVATEKEY;
export const host = process.env.NODE_ENV === 'development' ? process.env.DEV_HOST : process.env.PROD_HOST