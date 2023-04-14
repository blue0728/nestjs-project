import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "@/modules/auth/auth.module";
import { InviteLogService } from "./inviteLog.service";
import { InviteLogController } from "./inviteLog.controller";
import { InviteLogs } from "@/entitys";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([InviteLogs])],
  controllers: [InviteLogController],
  providers: [InviteLogService],
  exports: [InviteLogService],
})
export class InviteLogModule {}
