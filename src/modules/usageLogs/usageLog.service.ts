import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Not, Repository, UpdateResult } from "typeorm";
import { Goods, Users, UsageLogs, Notices } from "@/entitys";
import { GoodsEnum, UsageLogsEnum } from "@/common/enums";

@Injectable()
export class UsageLogService {
  constructor(
    @InjectRepository(UsageLogs)
    private readonly usageLogsRepository: Repository<UsageLogs>
  ) {}
  /**
   * 创建使用记录
   * @param param0
   * @returns
   */
  async create({
    uuid,
    useEndTime,
    state,
    goods,
    user,
  }: {
    uuid: string;
    useEndTime: Date;
    state: UsageLogsEnum;
    goods: Goods;
    user: Users;
  }): Promise<UsageLogs> {
    const usageLog = this.usageLogsRepository.create({
      uuid,
      useEndTime,
      state,
      goods,
      user,
    });
    return await this.usageLogsRepository.save(usageLog);
  }

  /**
   * 归还物品
   * @param uuid
   * @returns
   */
  async return(uuid: string): Promise<UpdateResult> {
    return await this.usageLogsRepository.update(uuid, {
      state: UsageLogsEnum.RETURNED,
    });
  }

  /**
   * 查询物品
   * @param goods
   * @returns
   */
  async findOneyByGoods(goods: Goods): Promise<UsageLogs> {
    return await this.usageLogsRepository.findOne({
      where: {
        goods,
        state: UsageLogsEnum.USED,
      },
      relations: ["user", "goods"],
    });
  }

  /**
   * 查询物品
   * @param goods
   * @returns
   */
  async findOneyByGoodsAndUser(
    goods: Goods,
    user: Users,
    state: number
  ): Promise<UsageLogs> {
    return await this.usageLogsRepository.findOne({
      where: {
        goods,
        user,
        state: Not(state),
      },
      relations: ["user", "goods", "notice"],
    });
  }

  /**
   * 查询所有物品
   * @param options
   * @returns
   */
  async findAllByUser(
    user: Users,
    offset: number,
    limit: number
  ): Promise<[items: UsageLogs[], count: number]> {
    return await this.usageLogsRepository.findAndCount({
      where: {
        user,
      },
      order: {
        createdAt: "DESC",
      },
      skip: offset,
      take: limit,
      relations: ["goods"],
      withDeleted: true,
    });
  }

  /**
   * 查询使用记录
   * @param state
   * @returns
   */
  async findAllByState(state: UsageLogsEnum): Promise<UsageLogs[]> {
    return await this.usageLogsRepository.find({
      where: {
        state,
      },
      relations: ["goods", "user"],
    });
  }

  /**
   * 查询物品信息
   * @param options
   * @returns
   */
  async findOneByUuidAndUser(uuid: string, user: Users): Promise<UsageLogs> {
    return await this.usageLogsRepository.findOne({
      where: {
        uuid,
        user,
      },
      relations: ["goods", "user"],
    });
  }

  /**
   * 更新
   * @param uuid
   * @param data
   * @returns
   */
  async updateNoticeByUuid(
    uuid: string,
    notice: Notices
  ): Promise<UpdateResult> {
    return await this.usageLogsRepository.update(uuid, {
      notice,
    });
  }

  /*
   * 更新
   * @param uuid
   * @param data
   * @returns
   */
  async updateStateByUuid(
    uuid: string,
    state: UsageLogsEnum
  ): Promise<UpdateResult> {
    return await this.usageLogsRepository.update(uuid, {
      state,
    });
  }
}
