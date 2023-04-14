import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenService } from "./token.service";
import { WeixinModule } from "@/modules/weixin/weixin.module";
import { Tokens } from "@/entitys";

@Module({
  imports: [WeixinModule, TypeOrmModule.forFeature([Tokens])],
  controllers: [],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
