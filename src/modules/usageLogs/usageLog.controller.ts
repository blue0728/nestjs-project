import { Controller, Get, Query, Req } from "@nestjs/common";
import { AuthService } from "@/modules/auth/auth.service";
import { UsageLogService } from "@/modules/usageLogs/usageLog.service";
import { Request } from "express";
import { UsageLogsListDto, UsageLogsDetailsDto } from "./dto/usageLogs.dto";
@Controller("usageLog")
export class UsageLogController {
  constructor(
    private readonly authService: AuthService,
    private readonly UsageLogService: UsageLogService
  ) {}
  @Get("list")
  async list(
    @Query() { page, pageSize }: UsageLogsListDto,
    @Req() req: Request
  ) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const [items, count] = await this.UsageLogService.findAllByUser(
      user,
      (page - 1) * pageSize,
      pageSize
    );
    return {
      items,
      count,
    };
  }

  @Get("details")
  async details(@Query() { uuid }: UsageLogsDetailsDto, @Req() req: Request) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const inviteLog = await this.UsageLogService.findOneByUuidAndUser(
      uuid,
      user
    );
    return inviteLog;
  }
}
