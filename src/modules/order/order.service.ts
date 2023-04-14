import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThanOrEqual, Repository } from "typeorm";
import { Orders, Users } from "@/entitys";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>
  ) {}

  /**
   * 创建订单
   * @param param0
   * @returns
   */
  async create({
    uuid,
    description,
    amount,
    user,
    prepay_id
  }: {
    uuid: string;
    description: string;
    amount: number;
    prepay_id: string;
    user: Users;
  }): Promise<Orders> {
    const order = this.ordersRepository.create({
      uuid,
      description,
      amount,
      user,
      prepay_id
    });
    // 创建新用户
    return await this.ordersRepository.save(order);
  }
}
