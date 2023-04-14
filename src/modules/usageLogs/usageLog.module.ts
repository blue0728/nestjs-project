import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "@/modules/auth/auth.module";
import { UsageLogService } from "./usageLog.service";
import { UsageLogController } from "./usageLog.controller";
import { TokenModule } from "@/modules/token/token.module";
import { UsageLogs } from "@/entitys";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UsageLogs]),
  ],
  controllers: [UsageLogController],
  providers: [UsageLogService],
  exports: [UsageLogService],
})
export class UsageLogModule {}
