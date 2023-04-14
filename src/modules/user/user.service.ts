import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "@/entitys";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>
  ) {}

  /**
   * 查询用户信息
   * @param openid
   * @returns
   */
  async findByOpenid(openid: string): Promise<Users> {
    return await this.usersRepository.findOneBy({
      openid,
    });
  }
}
