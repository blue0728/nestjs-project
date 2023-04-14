import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { InviteLogs, Users, Familys } from "@/entitys";
import { InviteLogsEnum } from "@/common/enums";

@Injectable()
export class InviteLogService {
  constructor(
    @InjectRepository(InviteLogs)
    private readonly inviteLogsRepository: Repository<InviteLogs>
  ) {}

  /**
   * 搜素物品信息
   * @param options
   * @returns
   */
  async findByUser({
    user,
    state,
    offset,
    limit,
  }: {
    user: Users;
    state: InviteLogsEnum;
    offset: number;
    limit: number;
  }): Promise<[items: InviteLogs[], count: number]> {
    return await this.inviteLogsRepository.findAndCount({
      where: {
        user,
        state,
      },
      order: {
        createdAt: "DESC",
      },
      skip: offset,
      take: limit,
    });
  }

  /**
   * 创建邀请记录
   * @param uuid
   * @param user
   * @param family
   * @returns
   */
  async create({
    uuid,
    user,
    family,
  }: {
    uuid: string;
    user: Users;
    family: Familys;
  }): Promise<InviteLogs> {
    const inviteLogs = this.inviteLogsRepository.create({
      uuid,
      user,
      family,
      state: InviteLogsEnum.NORMAL,
    });
    return await this.inviteLogsRepository.save(inviteLogs);
  }

  /**
   * 更新状态
   * @param uuid
   * @param state
   * @returns
   */
  async update({
    uuid,
    state,
    invitee,
  }: {
    uuid: string;
    state: InviteLogsEnum;
    invitee: Users;
  }): Promise<UpdateResult> {
    return await this.inviteLogsRepository.update(uuid, {
      invitee,
      state,
    });
  }

  /**
   * 查询邀请记录
   * @param uuid
   * @returns
   */
  async findOneByUuidAndUser(uuid: string, user: Users): Promise<InviteLogs> {
    return await this.inviteLogsRepository.findOne({
      where: {
        uuid,
        user
      },
      relations: ["user", "family"],
    });
  }
}
