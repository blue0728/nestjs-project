import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThanOrEqual, Repository } from "typeorm";
import { Tokens } from "@/entitys";
import { WeixinService } from "@/modules/weixin/weixin.service";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Tokens)
    private readonly tokensRepository: Repository<Tokens>,
    private readonly weixinService: WeixinService
  ) {}

  async getToken(): Promise<Tokens> {
    const token = await this.tokensRepository.findOne({
      where: {
        expires_in: MoreThanOrEqual(new Date(Date.now() + 8 * 60 * 60 * 1000)),
      },
      order: {
        createdAt: "DESC",
      },
    });
    if (!token) {
      await this.setToken();
      return await this.getToken();
    }
    return token;
  }

  async setToken(): Promise<Tokens> {
    const newToken = await this.weixinService.getToken();
    const token = this.tokensRepository.create({
      access_token: newToken.access_token,
      expires_in: new Date(
        Date.now() + 8 * 60 * 60 * 1000 + 1000 * (newToken.expires_in - 1800) // 过期时间为一个半小时
      ),
    });
    return await this.tokensRepository.save(token);
  }
}
