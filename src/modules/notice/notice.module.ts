import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NoticeService } from "./notice.service";
import { AuthModule } from "@/modules/auth/auth.module";
import { UsageLogModule } from "@/modules/usageLogs/usageLog.module";
import { GoodsModule } from "@/modules/goods/goods.module";
import { TokenModule } from "@/modules/token/token.module";
import { WeixinModule } from "@/modules/weixin/weixin.module";
import { NoticeController } from "./notice.controller";
import { Notices } from "@/entitys";

@Module({
  imports: [
    UsageLogModule,
    AuthModule,
    TokenModule,
    WeixinModule,
    forwardRef(() => GoodsModule),
    TypeOrmModule.forFeature([Notices]),
  ],
  controllers: [NoticeController],
  providers: [NoticeService],
  exports: [NoticeService],
})
export class NoticeModule {}
