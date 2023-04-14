import * as dotenv from "dotenv";
dotenv.config();

const localConfig = {
  port: 3306,
  host: "localhost",
  username: "root",
  password: "admin123456",
  datebase: "my-home",
  connectionLimit: 10,
};

const config =  localConfig //process.env.NODE_ENV !== "develop" ? prodConfig : localConfig;

export default config;
