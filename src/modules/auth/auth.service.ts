import { Users } from "@/entitys";
import { CustomException } from "@/common/http/customException";
import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "@/modules/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async validate(
    accessToken: string
  ): Promise<{ openid: string; session_key: string; unionid: string }> {
    try {
      if (!accessToken) {
        throw new CustomException("未登录", 401, null, HttpStatus.UNAUTHORIZED);
      }
      return await this.jwtService.verify(accessToken.split("Bearer ")[1]);
    } catch (error) {
      throw new CustomException("未登录", 401, null, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * 登录获取token
   * @param token
   * @returns
   */
  async login(token: {
    openid: string;
    session_key: string;
    unionid: number;
  }): Promise<{ access_token: string }> {
    return {
      access_token: this.jwtService.sign(token),
    };
  }

  /**
   * 获取用户信息
   * @param accessToken
   * @returns
   */
  async getUser(accessToken: string): Promise<Users> {
    const { openid } = await this.validate(accessToken);
    const user: Users = await this.userService.findByOpenid(openid);
    return user;
  }
}
