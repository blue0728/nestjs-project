import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MemberModule } from "@/modules/member/member.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { InviteLogModule } from "@/modules/inviteLog/inviteLog.module";
import { WarehouseModule } from "@/modules/warehouse/warehouse.module";
import { UserModule } from "@/modules/user/user.module";

import { FamilyController } from "./family.controller";
import { FamilyService } from "./family.service";
import { Familys } from "@/entitys";

@Module({
  imports: [
    InviteLogModule,
    AuthModule,
    UserModule,
    forwardRef(() => MemberModule),
    forwardRef(() => WarehouseModule),
    TypeOrmModule.forFeature([Familys]),
  ],
  controllers: [FamilyController],
  providers: [FamilyService],
  exports: [FamilyService],
})
export class FamilyModule {}
