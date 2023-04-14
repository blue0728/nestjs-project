import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WarehouseController } from "./warehouse.controller";
import { WarehouseService } from "./warehouse.service";
import { AuthModule } from "@/modules/auth/auth.module";
import { MemberModule } from "@/modules/member/member.module";
import { FamilyModule } from "@/modules/family/family.module";
import { GoodsModule } from "@/modules/goods/goods.module";
import { Warehouses } from "@/entitys";

@Module({
  imports: [
    AuthModule,
    MemberModule,
    GoodsModule,
    forwardRef(() => FamilyModule),
    TypeOrmModule.forFeature([Warehouses]),
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}
