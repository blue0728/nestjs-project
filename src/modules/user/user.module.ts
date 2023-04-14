import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { Users } from "@/entitys";

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
