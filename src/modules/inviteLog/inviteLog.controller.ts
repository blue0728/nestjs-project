import { InviteLogsEnum } from "@/common/enums";
import { Controller, Get, Query, Req } from "@nestjs/common";
import { InviteLogService } from "@/modules/inviteLog/inviteLog.service";
import { AuthService } from "@/modules/auth/auth.service";
import { Request } from "express";
import { InviteLogListDto, InviteLogDetailsDto } from "./dto/inviteLog.dto";
import { CustomException } from "@/common/http/customException";

@Controller("inviteLogs")
export class InviteLogController {
  constructor(
    private readonly inviteLogService: InviteLogService,
    private readonly authService: AuthService
  ) {}

  /**
   * 获取要邀请列表链接
   * @param page
   * @param pageSize
   * @param req
   * @returns
   */
  @Get("list")
  async list(
    @Query() { page, pageSize, state }: InviteLogListDto,
    @Req() req: Request
  ) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const [items, count] = await this.inviteLogService.findByUser({
      user,
      state,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
    return {
      items,
      count,
    };
  }

  @Get("details")
  async details(@Query() { uuid }: InviteLogDetailsDto, @Req() req: Request) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const inviteLog = await this.inviteLogService.findOneByUuidAndUser(
      uuid,
      user
    );
    return inviteLog;
  }
}
