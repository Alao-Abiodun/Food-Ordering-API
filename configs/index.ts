import dotenv from 'dotenv';
dotenv.config();

const { MONGO_URL, MY_PORT, JWT_SECRET_TOKEN } = process.env;

export const MONGO_URI = MONGO_URL;
export const PORT = MY_PORT;
export const JWT_SECRET = JWT_SECRET_TOKEN;