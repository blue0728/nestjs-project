import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WarehouseModule } from "@/modules/warehouse/warehouse.module";
import { MemberModule } from "@/modules/member/member.module";
import { UsageLogModule } from "@/modules/usageLogs/usageLog.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { FamilyModule } from "@/modules/family/family.module";
import { NoticeModule } from "@/modules/notice/notice.module";
import { GoodsController } from "./goods.controller";
import { GoodsService } from "./goods.service";
import { Goods } from "@/entitys";

@Module({
  imports: [
    AuthModule,
    forwardRef(() => NoticeModule),
    forwardRef(() => FamilyModule),
    forwardRef(() => MemberModule),
    forwardRef(() => WarehouseModule),
    forwardRef(() => UsageLogModule),
    TypeOrmModule.forFeature([Goods]),
  ],
  controllers: [GoodsController],
  providers: [GoodsService],
  exports: [GoodsService],
})
export class GoodsModule {}
