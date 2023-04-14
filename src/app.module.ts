import { AppController } from "./app.controllers";
import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { DbModule } from "@/db/db.module";
import {
  LoginModule,
  FamilyModule,
  InviteLogModule,
  GoodsModule,
  UsageLogModule,
  MemberModule,
  WeixinModule,
  AuthModule,
  AxiosHttpModule,
  TokenModule,
  NoticeModule,
  WarehouseModule,
  OrderModule
} from "./modules";
import { ScheduleModule } from "@nestjs/schedule";
import { ValidationPipe } from "./common/pipes/validation.pipe";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DbModule,
    WeixinModule,
    AuthModule,
    TokenModule,
    AxiosHttpModule,
    LoginModule,
    FamilyModule,
    InviteLogModule,
    MemberModule,
    GoodsModule,
    UsageLogModule,
    NoticeModule,
    WarehouseModule,
    OrderModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
