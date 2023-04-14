import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "./config";
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.datebase,
      synchronize: process.env.NODE_ENV !== "develop" ? false : true,
      logging: process.env.NODE_ENV !== "develop" ? false : true,
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      timezone: "Z",
      dateStrings: true,
    }),
  ],
})
export class DbModule {}
