import { Body, Controller, Post } from "@nestjs/common";
import { LoginService } from "./login.service";
import { CustomException } from "@/common/http/customException";
import { Public } from "@/common/decorators/public.decorators";
import { MemberService } from "@/modules/member/member.service";
import { FamilyService } from "@/modules/family/family.service";
import { AuthService } from "@/modules/auth/auth.service";
import { WarehouseService } from "@/modules/warehouse/warehouse.service";
import * as shortid from "shortid";
import { MembersTypeEnum } from "@/common/enums";
import { LoginSigninDto } from "./dto/login.dto";

@Controller("login")
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly memberService: MemberService,
    private readonly familyService: FamilyService,
    private readonly warehouseService: WarehouseService,
    private readonly authService: AuthService
  ) {}

  @Public()
  @Post("signin")
  async signin(@Body() { code }: LoginSigninDto) {
    const { session_key, openid, unionid } = await this.loginService.signin(
      code
    );
    let user = await this.loginService.findOne(openid);
    if (!user) {
      // 初始化用户/家庭/仓库/用户家庭关系
      user = await this.loginService.create(openid, unionid);
      // 创建默认家庭
      const family = await this.familyService.create({
        name: "默认空间",
        uuid: shortid.generate(),
      });
      // 创建默认仓库
      await this.warehouseService.create({
        uuid: shortid.generate(),
        family,
      });
      // 初始化家庭与成员关系
      await this.memberService.create({
        uuid: shortid.generate(),
        user,
        family,
        type: MembersTypeEnum.SUPADMIN,
      });
    }

    // 生成登录 token
    const { access_token } = await this.authService.login({
      openid,
      session_key,
      unionid,
    });
    return {token: access_token, ...user};
  }
}
