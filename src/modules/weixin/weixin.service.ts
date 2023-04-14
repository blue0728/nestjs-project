import { Injectable } from "@nestjs/common";
import { AxiosHttpService } from "@/modules/axiosHttp/axios.http.service";
import { miniProgramconfig } from "./config";
@Injectable()
export class WeixinService {
  constructor(private readonly axiosHttpService: AxiosHttpService) {}

  /**
   * 获取微信静默登录 token
   * @param code wx.login 获得的code
   * @returns
   */
  async jscode2session(code: string): Promise<Record<string, any>> {
    return await this.axiosHttpService.get(
      `${miniProgramconfig.ApiHost}/sns/jscode2session?appid=${miniProgramconfig.AppID}&secret=${miniProgramconfig.AppSecret}&js_code=${code}&grant_type=authorization_code`
    );
  }

  /**
   * 获取access_token
   * @returns
   */
  async getToken(): Promise<Record<string, any>> {
    return await this.axiosHttpService.get(
      `${miniProgramconfig.ApiHost}/cgi-bin/token?appid=${miniProgramconfig.AppID}&secret=${miniProgramconfig.AppSecret}&grant_type=client_credential`
    );
  }

  /**
   * 推送订阅消息
   * @param access_token
   * @param data
   * @returns
   */
  async sendMsg(access_token: string, data: any): Promise<Record<string, any>> {
    return await this.axiosHttpService.post(
      `${miniProgramconfig.ApiHost}/cgi-bin/message/subscribe/send?access_token=${access_token}`,
      {
        ...data,
      }
    );
  }

  /**
   * 预下单
   * @param description  商品描述
   * @param out_trade_no 订单号
   * @param amount 金额 分
   * @param payerOpenid 支付者openid
   * @returns
   */
  async preOrder(
    description: string,
    out_trade_no: string,
    amount: number,
    payerOpenid: string
  ): Promise<Record<string, any>> {
    return await this.axiosHttpService.post(
      `${miniProgramconfig.ApiMch}/v3/pay/transactions/jsapi`,
      {
        mchid: miniProgramconfig.Mchid,
        out_trade_no,
        appid: miniProgramconfig.AppID,
        description,
        notify_url: "", //todo 回调地址
        amount: {
          total: amount, // 分
          currency: "CNY",
        },
        payer: {
          openid: payerOpenid,
        },
      }
    );
  }
}
