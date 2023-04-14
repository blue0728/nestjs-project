import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Goods, Notices, Users, UsageLogs } from "@/entitys";
import {
  GoodsEnum,
  NoticeMiniprogramStateEnum,
  NoticesEnum,
  TemplateIdEnum,
  UsageLogsEnum,
} from "@/common/enums";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TokenService } from "@/modules/token/token.service";
import { WeixinService } from "@/modules/weixin/weixin.service";
import { UsageLogService } from "@/modules/usageLogs/usageLog.service";
import { GoodsService } from "@/modules/goods/goods.service";

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notices)
    private readonly noticessRepository: Repository<Notices>,
    private readonly tokenService: TokenService,
    private readonly usageLogService: UsageLogService,
    private readonly weixinService: WeixinService,
    private readonly goodsService: GoodsService
  ) {}

  /**
   * 查询未发送通知的记录
   * @returns
   */
  async findUnPush(): Promise<Notices[]> {
    return await this.noticessRepository.find({
      where: {
        state: NoticesEnum.UNPUSH,
      },
      relations: ["user", "goods", "usageLog"],
    });
  }

  /**
   * 创建通知记录
   * @param user
   * @param goods
   * @returns
   */
  async create({
    uuid,
    user,
    goods,
    usageLog,
    template_id,
    miniprogram_state,
  }: {
    uuid: string;
    user: Users;
    goods: Goods;
    usageLog: UsageLogs;
    template_id: TemplateIdEnum;
    miniprogram_state: NoticeMiniprogramStateEnum;
  }): Promise<Notices> {
    const notice = this.noticessRepository.create({
      uuid,
      user,
      goods,
      usageLog,
      state: NoticesEnum.UNPUSH,
      template_id,
      miniprogram_state,
    });
    // 创建新用户
    return await this.noticessRepository.save(notice);
  }

  /**
   * 更新
   * @param param0
   * @returns
   */
  async update({
    uuid,
    state,
    error,
  }: {
    uuid: string;
    state: NoticesEnum;
    error?: string;
  }): Promise<UpdateResult> {
    return await this.noticessRepository.update(uuid, {
      state,
      error,
    });
  }

  /**
   * 定时推送消息通知
   * @returns
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async sendMsg(): Promise<any> {
    const res = await Promise.all([
      this.findUnPush(),
      this.usageLogService.findAllByState(UsageLogsEnum.USED),
    ]);

    const usageLogs = res[1];
    usageLogs.forEach((item) => {
      const useEndTime = new Date(item.useEndTime).getTime();
      if (useEndTime < Date.now()) {
        this.usageLogService.updateStateByUuid(
          item.uuid,
          UsageLogsEnum.TIMEOUT
        );
        this.goodsService.updateState(item.goods.uuid, GoodsEnum.TIMEOUT);
      }
    });

    const notices = res[0];
    if (notices && notices.length) {
      const { access_token } = await this.tokenService.getToken();
      notices.forEach((notice) => {
        // 提前3分钟发送推送消息
        const useEndTime = new Date(notice.usageLog.useEndTime).getTime();
        if (
          useEndTime - 3 * 60 * 1000 <= Date.now() &&
          Date.now() <= useEndTime
        ) {
          this.weixinService
            .sendMsg(access_token, {
              touser: notice.user.openid,
              template_id: notice.template_id,
              miniprogram_state: notice.miniprogram_state,
              page: "/pages/goods/index?uuid=" + notice.goods.uuid,
              data: {
                thing1: {
                  value: `${notice.goods.name}使用时间快到了！`,
                },
                phrase3: {
                  value: "到期提醒",
                },
              },
            })
            .then(() => {
              this.update({
                uuid: notice.uuid,
                state: NoticesEnum.PUSHED,
              });
            })
            .catch((error) => {
              this.update({
                uuid: notice.uuid,
                state: NoticesEnum.PUSHED,
                error:
                  error.message ||
                  error.response?.data?.message ||
                  error.response?.statusText,
              });
            });
        }
      });
    }

    return "ok";
  }
}
