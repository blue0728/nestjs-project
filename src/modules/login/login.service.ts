import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WeixinService } from "@/modules/weixin/weixin.service";
import { Users } from "@/entitys";

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly weixinService: WeixinService
  ) {}

  /**
   * 登录
   * @param code
   * @returns
   */
  async signin(code: string): Promise<Record<string, any>> {
    return await this.weixinService.jscode2session(code);
  }

  /**
   * 查询用户
   * @param openid
   * @returns
   */
  async findOne(openid: string): Promise<Users> {
    return await this.usersRepository.findOneBy({
      openid,
    });
  }

  /**
   * 初始化新用户和家庭
   * @param openid
   * @param unionid
   * @returns
   */
  async create(openid: string, unionid: string): Promise<Users> {
    const user = this.usersRepository.create({
      openid,
      unionid,
    });
    // 创建新用户
    return await this.usersRepository.save(user);
  }
}
