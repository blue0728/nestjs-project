import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { FamilyService } from "./family.service";
import { AuthService } from "@/modules/auth/auth.service";
import { MemberService } from "@/modules/member/member.service";
import { WarehouseService } from "@/modules/warehouse/warehouse.service";
import { InviteLogService } from "@/modules/inviteLog/inviteLog.service";
import { UserService } from "@/modules/user/user.service";
import { CustomException } from "@/common/http/customException";
import { Request } from "express";
import { Members, Users } from "@/entitys";
import { InviteLogsEnum, MembersTypeEnum } from "@/common/enums";
import * as shortid from "shortid";
import {
  FamilyCreateDto,
  FamilyJoinDto,
  FamilyMemberDto,
  FamilyUpdateDto,
} from "./dto/family.dto";
@Controller("family")
export class FamilyController {
  constructor(
    private readonly familyService: FamilyService,
    private readonly memberService: MemberService,
    private readonly authService: AuthService,
    private readonly warehouseService: WarehouseService,
    private readonly inviteLogService: InviteLogService,
    private readonly userService: UserService
  ) {}

  /**
   * 获取家庭列表
   * @param req
   * @returns
   */
  @Get("list")
  async list(@Req() req: Request) {
    const user: Users = await this.authService.getUser(
      req.headers["authorization"]
    );
    const members: Members[] = await this.memberService.findByUser(user);
    const famylys = await this.familyService.findByMembers(members);
    return famylys;
  }

  /**
   * 创建新家庭
   * @param name
   * @param req
   * @returns
   */
  @Post("create")
  async create(@Body() { name }: FamilyCreateDto, @Req() req: Request) {
    const user: Users = await this.authService.getUser(
      req.headers["authorization"]
    );

    const members: Members[] = await this.memberService.findByUser(user);
    const supMembers = members.filter(
      (item) => item.type === MembersTypeEnum.SUPADMIN
    );
    if(supMembers.length === user.maxNumber){
      throw new CustomException(`只能创建${user.maxNumber}个空间，如需更多空间，请联系客服`)
    }

    // 创建新家庭
    const family = await this.familyService.create({
      name,
      uuid: shortid.generate(),
    });
    // 创建新的家庭关系
    await this.memberService.create({
      uuid: shortid.generate(),
      user,
      family,
      type: MembersTypeEnum.SUPADMIN,
    });

    return family;
  }

  /**
   * 更新家庭信息
   * @param uuid
   * @param name
   * @param req
   * @returns
   */
  @Post("update")
  async update(@Body() { name, uuid }: FamilyUpdateDto, @Req() req: Request) {
    const user: Users = await this.authService.getUser(
      req.headers["authorization"]
    );
    const family = await this.familyService.findOneByUuid(uuid);
    if (family) {
      const member = await this.memberService.findOneByUserAndFamily(
        family,
        user
      );
      if (member) {
        if (member.type === MembersTypeEnum.MEMBER) {
          throw new CustomException("非法操作");
        }
        await this.familyService.update(uuid, name);
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  /**
   * 查询家庭成员
   * @param familyUuid
   * @param req
   * @returns
   */
  @Get("member")
  async member(@Query() { familyUuid }: FamilyMemberDto, @Req() req: Request) {
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
        const member = await this.memberService.findByFamily(family);
        return member;
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  /**
   * 邀请新成员
   * @param familyUuid
   * @param req
   * @returns
   */
  @Post("invite")
  async invite(@Body() { familyUuid }: FamilyMemberDto, @Req() req: Request) {
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
          throw new CustomException("非法操作");
        }
        const inviteLog = await this.inviteLogService.create({
          uuid: shortid.generate(),
          user,
          family,
        });
        return inviteLog;
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  /**
   * 加入家庭
   * @param uuid
   * @param req
   * @returns
   */
  @Post("join")
  async join(@Body() { uuid }: FamilyJoinDto, @Req() req: Request) {
    const user: Users = await this.authService.getUser(
      req.headers["authorization"]
    );
    const inviteLogs = await this.inviteLogService.findOneByUuidAndUser(
      uuid,
      user
    );
    if (inviteLogs) {
      if (inviteLogs.state === InviteLogsEnum.USED) {
        throw new CustomException("邀请链接已经失效");
      }
      const member = await this.memberService.findOneByUserAndFamily(
        inviteLogs.family,
        user
      );
      if (member) {
        throw new CustomException("已是成员");
      }
      // 更新邀请记录
      await this.inviteLogService.update({
        uuid,
        state: InviteLogsEnum.USED,
        invitee: user,
      });
      // 加入家庭
      await this.memberService.create({
        uuid: shortid.generate(),
        user,
        family: inviteLogs.family,
        type: MembersTypeEnum.MEMBER,
      });
      return "ok";
    } else {
      throw new CustomException("结果不存在");
    }
  }

  @Post("delete")
  async delete(@Body() { familyUuid }: FamilyMemberDto, @Req() req: Request) {
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
          throw new CustomException("非法操作");
        }
        const members = await this.memberService.findByFamily(family);
        if (members.length > 1) {
          throw new CustomException("无法删除，请先清理成员");
        }
        const warehouses = await this.warehouseService.findAllByFamily(family);
        if (warehouses.length) {
          throw new CustomException("无法删除，请先删除所有储物室");
        }
        //先删除删除关系
        await this.memberService.delete(member.uuid);
        // 再删除家庭
        await this.familyService.delete(familyUuid);
        return warehouses;
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }
}
