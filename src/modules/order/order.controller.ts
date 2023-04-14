import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { AuthService } from "@/modules/auth/auth.service";
import { OrderService } from "./order.service";
import { CustomException } from "@/common/http/customException";
import { WeixinService } from "@/modules/weixin/weixin.service";
import * as dayjs from "dayjs";
import { OrdersCreateDto } from "./dto/orders.dto";
import { Request } from "express";

@Controller("order")
export class orderController {
  constructor(
    private readonly authService: AuthService,
    private readonly weixinService: WeixinService,
    private readonly orderService: OrderService
  ) {}

  /**
   * 创建订单
   * @param param0 
   * @param req 
   * @returns 
   */
  @Post("create")
  async create(@Body() { amount }: OrdersCreateDto, @Req() req: Request) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const rand = Math.random();
    const mineId = Math.round(rand * 100000000);
    const uuid = dayjs().format("YYYYMMDDHHmmssSSS") + mineId;
    const description = "购买升级";
    const { prepay_id } = await this.weixinService.preOrder(
      description,
      uuid,
      amount,
      user.openid
    );

    await this.orderService.create({
      uuid,
      description,
      amount,
      user,
      prepay_id,
    });

    return prepay_id;
  }
}
