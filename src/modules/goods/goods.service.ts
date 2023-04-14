import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, In, Like, Repository, UpdateResult } from "typeorm";
import { Goods, Users, Warehouses } from "@/entitys";
import { GoodsEnum } from "@/common/enums";
import { Not } from "typeorm";
@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Goods)
    private readonly goodsRepository: Repository<Goods>
  ) {}

  /**
   * 创建仓库
   * @param uuid
   * @param name
   * @returns
   */
  async create({
    name = "默认物品",
    uuid,
    cover = "http://family.w3cclub.com/goods_new_fill.png",
    warehouse,
    user,
  }: {
    name: string;
    uuid: string;
    cover: string;
    warehouse: Warehouses;
    user: Users;
  }): Promise<Goods> {
    const goods = this.goodsRepository.create({
      name,
      uuid,
      cover,
      warehouse,
      user,
    });
    return await this.goodsRepository.save(goods);
  }

  /**
   * 查询所有物品
   * @param options
   * @returns
   */
  async findAllByWarehouse({
    warehouse,
    offset,
    limit,
  }: {
    warehouse: Warehouses;
    offset: number;
    limit: number;
  }): Promise<[items: Goods[], count: number]> {
    return await this.goodsRepository.findAndCount({
      where: {
        warehouse,
      },
      order: {
        createdAt: "DESC",
      },
      skip: offset,
      take: limit,
      relations: ["user"],
    });
  }

  /**
   * 查询所有物品by state
   * @param state
   * @param warehouses
   * @returns
   */
  async findByState(state: number, warehouses: Warehouses[]): Promise<Goods[]> {
    return await this.goodsRepository.find({
      where: {
        state: Not(state),
        warehouse: warehouses,
      },
    });
  }

  /**
   * 查询所有使用中物品
   * @returns
   */
  async findByUsed(): Promise<Goods[]> {
    return await this.goodsRepository.find({
      where: {
        state: GoodsEnum.USED,
      },
    });
  }

  /**
   * 查询所有物品
   * @param options
   * @returns
   */
  async findAllByWarehouses({
    warehouses,
    offset,
    limit,
  }: {
    warehouses: Warehouses[];
    offset: number;
    limit: number;
  }): Promise<[items: Goods[], count: number]> {
    return await this.goodsRepository.findAndCount({
      where: {
        warehouse: warehouses,
      },
      order: {
        createdAt: "DESC",
      },
      skip: offset,
      take: limit,
      relations: ["warehouse"],
    });
  }

  /**
   * 查询所有物品
   * @param options
   * @returns
   */
  async findByWarehouse(warehouse: Warehouses): Promise<Goods[]> {
    return await this.goodsRepository.find({
      where: {
        warehouse,
      },
    });
  }

  /**
   * 查询物品信息
   * @param options
   * @returns
   */
  async findOneByUuid(uuid: string): Promise<Goods> {
    return await this.goodsRepository.findOne({
      where: {
        uuid,
      },
      relations: ["warehouse", "usageLog"],
    });
  }

  /**
   * 搜素物品信息
   * @param options
   * @returns
   */
  async search({
    keyword,
    warehouses,
    offset,
    limit,
  }: {
    keyword: string;
    warehouses: Warehouses[];
    offset: number;
    limit: number;
  }): Promise<[items: Goods[], count: number]> {
    return await this.goodsRepository.findAndCount({
      where: {
        name: Like(`%${keyword}%`),
        warehouse: warehouses,
      },
      skip: offset,
      take: limit,
      order: {
        createdAt: "DESC",
      },
      relations: ["warehouse"],
    });
  }

  /**
   * 更新物品
   * @param uuid
   * @param param1
   * @returns
   */
  async update(
    uuid: string,
    {
      name,
      cover,
      warehouse,
      user,
    }: {
      name: string;
      cover: string;
      warehouse: Warehouses;
      user: Users;
    }
  ): Promise<UpdateResult> {
    return await this.goodsRepository.update(uuid, {
      name,
      cover,
      warehouse,
      user,
    });
  }

  /**
   * 更新物品
   * @param uuid
   * @param state
   * @returns
   */
  async updateState(uuid: string, state: GoodsEnum): Promise<UpdateResult> {
    return await this.goodsRepository.update(uuid, {
      state,
    });
  }

  /**
   * 使用物品
   * @param uuid
   * @param state
   * @param useTimes
   * @returns
   */
  async useGoods(
    uuid: string,
    state: GoodsEnum,
    useTimes: number
  ): Promise<UpdateResult> {
    return await this.goodsRepository.update(uuid, {
      state,
      useTimes,
    });
  }

  /**
   * 归还物品
   * @param uuid
   * @returns
   */
  async return(uuid: string): Promise<UpdateResult> {
    return await this.goodsRepository.update(uuid, {
      state: GoodsEnum.NORMAL,
    });
  }

  /**
   * 删除物品
   * @param uuid
   * @returns
   */
  async delete(uuid: string): Promise<DeleteResult> {
    return await this.goodsRepository.softDelete(uuid);
  }

  /**
   * 批量删除物品
   * @param uuids
   * @returns
   */
  async batchDelete(uuids: []): Promise<DeleteResult> {
    return await this.goodsRepository.softDelete(uuids);
  }
}
