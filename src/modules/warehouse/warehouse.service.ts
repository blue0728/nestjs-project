import { WarehouseStateEnum } from "@/common/enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, In, Repository, UpdateResult } from "typeorm";
import { Warehouses, Familys } from "@/entitys";
@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouses)
    private readonly warehousesRepository: Repository<Warehouses>
  ) {}

  /**
   * 创建仓库
   * @param uuid
   * @param name
   * @returns
   */
  async create({
    name = "默认储物室",
    uuid,
    cover = "http://family.w3cclub.com/%E5%BD%A9%E8%89%B2-%E7%82%AB%E5%BD%A9%E7%9B%92%E5%AD%90.png",
    family,
    state = WarehouseStateEnum.PUBLIC,
  }): Promise<Warehouses> {
    const warehouse = this.warehousesRepository.create({
      name,
      uuid,
      cover,
      family,
      state,
    });
    return await this.warehousesRepository.save(warehouse);
  }

  /**
   * 查询所有仓库
   * @param options
   * @returns
   */
  async findAllByFamily(
    family: Familys,
    state?: WarehouseStateEnum
  ): Promise<Warehouses[]> {
    return await this.warehousesRepository.find({
      where: {
        family,
        state,
      },
      order: {
        createdAt: "DESC",
      },
      relations: ["family"],
    });
  }

  /**
   * 查询所有公开仓库
   * @param options
   * @returns
   */
  async findAllByFamilys(
    familys: Familys[],
    state?: WarehouseStateEnum
  ): Promise<Warehouses[]> {
    return await this.warehousesRepository.find({
      where: {
        family: familys,
        state,
      },
      order: {
        createdAt: "DESC",
      },
      relations: ["family", "goods"],
    });
  }

  /**
   * 查询所有仓库
   * @param options
   * @returns
   */
  async findOneByUuid(uuid: string): Promise<Warehouses> {
    return await this.warehousesRepository.findOne({
      where: {
        uuid,
      },
      relations: ["family", "goods"],
    });
  }

  /**
   * 更新仓库
   * @param uuid
   * @param param1
   * @returns
   */
  async update(uuid: string, { name, cover }): Promise<UpdateResult> {
    return await this.warehousesRepository.update(uuid, {
      name,
      cover,
    });
  }

  /**
   * 删除仓库
   * @param uuid
   * @returns
   */
  async delete(uuid: string): Promise<DeleteResult> {
    return await this.warehousesRepository.softDelete(uuid);
  }
}
