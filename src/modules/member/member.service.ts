import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Members, Users, Familys } from "@/entitys";
import { MembersTypeEnum } from "@/common/enums";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Members)
    private readonly membersRepository: Repository<Members>
  ) {}

  /**
   * 查询家庭与用户关系
   * @param family
   * @param use
   * @returns
   */
  async findOneByUserAndFamily(family: Familys, user: Users): Promise<Members> {
    return await this.membersRepository.findOneBy({
      family,
      user,
    });
  }

  /**
   * 查询用户家庭列表
   * @param user
   * @returns
   */
  async findByUser(user: Users): Promise<Members[]> {
    return await this.membersRepository.find({
      where: {
        user,
      },
      relations: ["family"],
    });
  }

  /**
   * 查询用户家庭列表
   * @param user
   * @returns
   */
  async findByFamily(family: Familys): Promise<Members[]> {
    return await this.membersRepository.find({
      where: {
        family,
      },
      relations: ["user"],
    });
  }

  /**
   * 查询用户家庭信息
   * @param uuid
   * @returns
   */
  async findOneByUuid(uuid: string): Promise<Members> {
    return await this.membersRepository.findOne({
      where: {
        uuid,
      },
      relations: ["family", "user"],
    });
  }

  /**
   * 查询用户家庭信息
   * @param uuid
   * @returns
   */
  async findByUuid(uuid: string): Promise<Members[]> {
    return await this.membersRepository.find({
      where: {
        uuid,
      },
    });
  }

  /**
   * 更新成员类型
   * @param uuid
   * @param type
   * @returns
   */
  async updateType(uuid: string, type: MembersTypeEnum): Promise<UpdateResult> {
    return await this.membersRepository.update(uuid, {
      type,
    });
  }

  /**
   * 创建家庭关系
   * @param uuid
   * @param user
   * @param family
   * @returns
   */
  async create({
    uuid,
    user,
    family,
    type,
  }: {
    uuid: string;
    user: Users;
    family: Familys;
    type: MembersTypeEnum;
  }): Promise<Members> {
    const member = this.membersRepository.create({
      uuid,
      user,
      family,
      type,
    });
    return await this.membersRepository.save(member);
  }

  /**
   * 删除
   * @param uuid
   * @returns
   */
  async delete(uuid: string): Promise<DeleteResult> {
    return await this.membersRepository.softDelete(uuid);
  }

  /**
   * 移除家庭成员
   * @param family
   * @param user
   * @returns
   */
  async remove(family: Familys, user: Users): Promise<DeleteResult> {
    return await this.membersRepository.softDelete({
      family,
      user,
    });
  }
}
