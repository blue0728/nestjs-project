import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoginService } from "./login.service";
import { LoginController } from "./login.controller";
import { FamilyModule } from "@/modules/family/family.module";
import { MemberModule } from "@/modules/member/member.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { WeixinModule } from "@/modules/weixin/weixin.module";
import { WarehouseModule } from "@/modules/warehouse/warehouse.module";
import { Users } from "@/entitys";

@Module({
  imports: [
    AuthModule,
    WeixinModule,
    WarehouseModule,
    FamilyModule,
    MemberModule,
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [LoginController],
  providers: [LoginService],
  exports: [],
})
export class LoginModule {}
