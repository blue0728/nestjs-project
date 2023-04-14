import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { AuthService } from "@/modules/auth/auth.service";
import { UsageLogService } from "@/modules/usageLogs/usageLog.service";
import { GoodsService } from "@/modules/goods/goods.service";
import { NoticeService } from "./notice.service";
import { CustomException } from "@/common/http/customException";
import { Request } from "express";
import * as shortid from "shortid";
import { GoodsEnum, TemplateIdEnum , UsageLogsEnum} from "@/common/enums";
import { NoticesCreateDto } from "./dto/notices.dto";

@Controller("notice")
export class NoticeController {
  constructor(
    private readonly authService: AuthService,
    private readonly usageLogService: UsageLogService,
    private readonly goodsService: GoodsService,
    private readonly noticeService: NoticeService
  ) {}

  /**
   * 创建通知
   * @param goodsUuid
   * @param req
   * @returns
   */
  @Post("create")
  async create(
    @Body() { goodsUuid, miniprogram_state }: NoticesCreateDto,
    @Req() req: Request
  ) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const goods = await this.goodsService.findOneByUuid(goodsUuid);
    if (goods) {
      if (goods.state === GoodsEnum.NORMAL) {
        throw new CustomException("状态错误");
      }
      const usageLog = await this.usageLogService.findOneyByGoodsAndUser(
        goods,
        user,
        UsageLogsEnum.RETURNED
      );
      if (usageLog) {
        if (usageLog.notice) {
          throw new CustomException("通知已创建");
        }
        const notice = await this.noticeService.create({
          uuid: shortid.generate(),
          user,
          goods,
          usageLog,
          template_id: TemplateIdEnum.TIMEOUT_NOTICE,
          miniprogram_state,
        });
        await this.usageLogService.updateNoticeByUuid(usageLog.uuid, notice);
        return "ok";
      } else {
        throw new CustomException("结果不存在");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }
}
