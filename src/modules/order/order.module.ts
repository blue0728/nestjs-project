import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderService } from "./order.service";
import { WeixinModule } from "@/modules/weixin/weixin.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { orderController } from "./order.controller";
import { Orders } from "@/entitys";

@Module({
  imports: [AuthModule, WeixinModule, TypeOrmModule.forFeature([Orders])],
  controllers: [orderController],
  providers: [OrderService],
  exports: [],
})
export class OrderModule {}
