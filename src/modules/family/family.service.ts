import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Familys, Members } from "@/entitys";
@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Familys)
    private readonly familysRepository: Repository<Familys>
  ) {}

  /**
   * 查询家庭
   * @param uuid
   * @returns
   */
  async findOneByUuid(uuid: string): Promise<Familys> {
    return await this.familysRepository.findOne({
      where: {
        uuid,
      },
      relations: ["warehouse", "member"],
    });
  }

  /**
   * 查询家庭
   * @param members
   * @returns
   */
  async findByMembers(members: Members[]): Promise<Familys[]> {
    return await this.familysRepository.find({
      where: {
        member: members,
      },
      relations: ["member"]
    });
  }

  /**
   * 创建家庭
   * @param uuid
   * @param name
   * @returns
   */
  async create({ name, uuid }): Promise<Familys> {
    const family = this.familysRepository.create({
      name,
      uuid,
    });
    return await this.familysRepository.save(family);
  }

  /**
   * 更新家庭
   * @param uuid
   * @returns
   */
  async update(uuid: string, name: string): Promise<UpdateResult> {
    return await this.familysRepository.update(uuid, {
      name,
    });
  }

  /**
   * 删除家庭
   * @param uuid
   * @returns
   */
  async delete(uuid: string): Promise<DeleteResult> {
    return await this.familysRepository.softDelete(uuid);
  }
}
