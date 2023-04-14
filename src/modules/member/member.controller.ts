import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "@/modules/auth/auth.service";
import { CustomException } from "@/common/http/customException";
import { FamilyService } from "@/modules/family/family.service";
import { UserService } from "@/modules/user/user.service";
import { MemberService } from "./member.service";
import { Request } from "express";
import { Users } from "@/entitys";
import { MembersTypeEnum } from "@/common/enums";
import {
  MemberLeaveDto,
  MemberRemoveDto,
  MemberUpdateDto,
} from "./dto/member.dto";

@Controller("member")
export class MemberController {
  constructor(
    private readonly authService: AuthService,
    private readonly familyService: FamilyService,
    private readonly userService: UserService,
    private readonly memberService: MemberService
  ) {}

  /**
   * 离开家庭
   * @param familyUuid
   * @param req
   */
  @Post("leave")
  async leave(@Body() { familyUuid }: MemberLeaveDto, @Req() req: Request) {
    const user: Users = await this.authService.getUser(
      req.headers["authorization"]
    );
    const family = await this.familyService.findOneByUuid(familyUuid);
    if (family) {
      const member = await this.memberService.findOneByUserAndFamily(
        family,
        user
      );
      if (member) {
        if (member.type === MembersTypeEnum.SUPADMIN) {
          throw new CustomException("请先转移你的超级管理员权限");
        }
        await this.memberService.remove(family, user);
        return "ok";
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  /**
   * 移除家庭成员
   * @param familyUuid
   * @param req
   */
  @Post("remove")
  async remove(
    @Body() { familyUuid, userOpenid }: MemberRemoveDto,
    @Req() req: Request
  ) {
    const user: Users = await this.authService.getUser(
      req.headers["authorization"]
    );
    const family = await this.familyService.findOneByUuid(familyUuid);
    if (family) {
      const member = await this.memberService.findOneByUserAndFamily(
        family,
        user
      );
      if (member) {
        if (member.type === MembersTypeEnum.MEMBER) {
          throw new CustomException("您不是管理员，无权操作");
        }
        const leaveUser = await this.userService.findByOpenid(userOpenid);
        const leaveMember = await this.memberService.findOneByUserAndFamily(
          family,
          leaveUser
        );
        if (member.type === MembersTypeEnum.ADMIN) {
          if (
            leaveMember.type === MembersTypeEnum.SUPADMIN ||
            leaveMember.type === MembersTypeEnum.ADMIN
          ) {
            throw new CustomException("管理员不可被删除");
          }
        }
        if (member.uuid === leaveMember.uuid) {
          throw new CustomException("自己不可删除自己");
        }
        await this.memberService.remove(family, leaveUser);
        return "ok";
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  @Post("update")
  async update(
    @Body() { userOpenid, familyUuid, type }: MemberUpdateDto,
    @Req() req: Request
  ) {
    const user: Users = await this.authService.getUser(
      req.headers["authorization"]
    );
    const family = await this.familyService.findOneByUuid(familyUuid);
    if (family) {
      const member = await this.memberService.findOneByUserAndFamily(
        family,
        user
      );
      if (member) {
        if (member.type === MembersTypeEnum.MEMBER) {
          throw new CustomException("您不是管理员，无权操作");
        }
        // 需要更新成员的信息
        const updateUser = await this.userService.findByOpenid(userOpenid);
        const updateMember = await this.memberService.findOneByUserAndFamily(
          family,
          updateUser
        );
        if (
          type === MembersTypeEnum.SUPADMIN &&
          member.type !== MembersTypeEnum.SUPADMIN
        ) {
          throw new CustomException("非法操作");
        }
        // 转移自己的超级管理员权限
        if (
          member.type === MembersTypeEnum.SUPADMIN &&
          type === MembersTypeEnum.SUPADMIN
        ) {
          await this.memberService.updateType(updateMember.uuid, type);
          // 自己将降级为普通人员
          await this.memberService.updateType(
            member.uuid,
            MembersTypeEnum.MEMBER
          );
        } else {
          await this.memberService.updateType(updateMember.uuid, type);
        }
        return "ok";
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }
}
