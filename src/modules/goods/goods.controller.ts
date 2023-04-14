import { FamilyService } from "@/modules/family/family.service";
import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { AuthService } from "@/modules/auth/auth.service";
import { MemberService } from "@/modules/member/member.service";
import { WarehouseService } from "@/modules/warehouse/warehouse.service";
import { UsageLogService } from "@/modules/usageLogs/usageLog.service";
import { NoticeService } from "@/modules/notice/notice.service";
import { GoodsService } from "./goods.service";
import { CustomException } from "@/common/http/customException";
import { Request } from "express";
import { Familys, Users, Warehouses } from "@/entitys";
import * as shortid from "shortid";
import {
  GoodsEnum,
  MembersTypeEnum,
  NoticesEnum,
  UsageLogsEnum,
  WarehouseStateEnum,
} from "@/common/enums";
import {
  GoodsListDto,
  GoodsListBywarehouseDto,
  GoodsDetailsDto,
  GoodsSearchDto,
  GoodsCreateDto,
  GoodsUpdateDto,
  GoodsUseDto,
  GoodsDeleteDto,
  GoodsReturnDto,
  GoodsBatchDeleteDto,
} from "./dto/goods.dto";
@Controller("goods")
export class GoodsController {
  constructor(
    private readonly goodsService: GoodsService,
    private readonly authService: AuthService,
    private readonly memberService: MemberService,
    private readonly usageLogService: UsageLogService,
    private readonly warehouseService: WarehouseService,
    private readonly familyService: FamilyService,
    private readonly noticeService: NoticeService
  ) {}

  /**
   * 获取所有仓库物品
   * @param page
   * @param pageSize
   * @param req
   * @returns
   */
  @Get("list")
  async list(@Query() { page, pageSize }: GoodsListDto, @Req() req: Request) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const members = await this.memberService.findByUser(user);
    const adminFamilys = [];
    const memberFamilys = [];
    // 筛选出是否是管理员的家庭
    members.forEach((member) => {
      if (member.type === MembersTypeEnum.MEMBER) {
        memberFamilys.push(member.family);
      } else {
        adminFamilys.push(member.family);
      }
    });
    // 获取管理员家庭所有仓库和非管理员公开类型仓库
    let adminWarehouses = [];
    let memberWarehouses = [];
    if (adminFamilys && adminFamilys.length) {
      adminWarehouses = await this.warehouseService.findAllByFamilys(
        adminFamilys
      );
    }
    if (memberFamilys && memberFamilys.length) {
      memberWarehouses = await this.warehouseService.findAllByFamilys(
        memberFamilys,
        WarehouseStateEnum.PUBLIC
      );
    }
    // 查询仓库内物品
    const [items, count] = await this.goodsService.findAllByWarehouses({
      warehouses: [...adminWarehouses, ...memberWarehouses],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return {
      items,
      count,
    };
  }

  /**
   * 获取使用中的物品
   * @param req
   * @returns
   */
  @Get("listByUse")
  async listByUse(@Req() req: Request) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const members = await this.memberService.findByUser(user);
    const family = members.map((member) => member.family);
    const warehouses = await this.warehouseService.findAllByFamilys(family);
    const goods = await this.goodsService.findByState(
      GoodsEnum.NORMAL,
      warehouses
    );
    return {
      used: goods.filter((item) => item.state === GoodsEnum.USED).length,
      timeout: goods.filter((item) => item.state === GoodsEnum.TIMEOUT).length,
    };
  }

  /**
   * 获取仓库下的物品
   * @param warehouseUuid
   * @param page
   * @param pageSize
   * @param req
   * @returns
   */
  @Get("listBywarehouse")
  async listBywarehouse(
    @Query() { warehouseUuid, page, pageSize }: GoodsListBywarehouseDto,
    @Req() req: Request
  ) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const warehouse = await this.warehouseService.findOneByUuid(warehouseUuid);
    if (warehouse) {
      const member = await this.memberService.findOneByUserAndFamily(
        warehouse.family,
        user
      );
      if (member) {
        if (
          member.type === MembersTypeEnum.MEMBER &&
          warehouse.state === WarehouseStateEnum.PRIVATE
        ) {
          throw new CustomException("非法操作");
        }
        const [items, count] = await this.goodsService.findAllByWarehouse({
          warehouse,
          offset: (page - 1) * pageSize,
          limit: pageSize,
        });

        return {
          items,
          count,
        };
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  /**
   * 获取物品详情
   * @param uuid
   * @param req
   * @returns
   */
  @Get("details")
  async details(@Query() { uuid }: GoodsDetailsDto, @Req() req: Request) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const goods = await this.goodsService.findOneByUuid(uuid);
    if (goods) {
      const warehouse = await this.warehouseService.findOneByUuid(
        goods.warehouse.uuid
      );
      const member = await this.memberService.findOneByUserAndFamily(
        warehouse.family,
        user
      );
      if (member) {
        if (member.type === MembersTypeEnum.MEMBER) {
          throw new CustomException("非法操作");
        }
        return goods;
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  /**
   * 在所有仓库内搜索物品
   * @param keyword
   * @param req
   * @returns
   */
  @Get("search")
  async search(
    @Query()
    { keyword, familyUuid, warehouseUuid, page, pageSize }: GoodsSearchDto,
    @Req() req: Request
  ) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    let family: Familys;
    let warehouses: Warehouses[] = [];
    if (familyUuid) {
      family = await this.familyService.findOneByUuid(familyUuid);
      if (!family) {
        throw new CustomException("结果不存在");
      }
      const member = await this.memberService.findOneByUserAndFamily(
        family,
        user
      );
      if (!member) {
        throw new CustomException("非法操作");
      }
      if (warehouseUuid) {
        const warehouse = await this.warehouseService.findOneByUuid(
          warehouseUuid
        );
        if (member.type === MembersTypeEnum.MEMBER) {
          if (warehouse.state === WarehouseStateEnum.PUBLIC) {
            warehouses.push(warehouse);
          } else {
            throw new CustomException("非法操作");
          }
        } else {
          warehouses.push(warehouse);
        }
      } else {
        if (member.type === MembersTypeEnum.MEMBER) {
          warehouses = await this.warehouseService.findAllByFamily(
            family,
            WarehouseStateEnum.PUBLIC
          );
        } else {
          warehouses = await this.warehouseService.findAllByFamily(family);
        }
      }
    } else {
      const members = await this.memberService.findByUser(user);
      const adminFamilys = [];
      const memberFamilys = [];
      // 筛选出是否是管理员的家庭
      members.forEach((member) => {
        if (member.type === MembersTypeEnum.MEMBER) {
          memberFamilys.push(member.family);
        } else {
          adminFamilys.push(member.family);
        }
      });
      // 获取管理员家庭所有仓库和非管理员公开类型仓库
      let adminWarehouses = [];
      let memberWarehouses = [];
      if (adminFamilys && adminFamilys.length) {
        adminWarehouses = await this.warehouseService.findAllByFamilys(
          adminFamilys
        );
      }
      if (memberFamilys && memberFamilys.length) {
        memberWarehouses = await this.warehouseService.findAllByFamilys(
          memberFamilys,
          WarehouseStateEnum.PUBLIC
        );
      }
      warehouses = [...adminWarehouses, ...memberWarehouses];
    }
    const [items, count] = await this.goodsService.search({
      keyword,
      warehouses,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
    return { items, count };
  }

  /**
   * 添加物品
   * @param warehouseUuid
   * @param cover
   * @param name
   * @param req
   * @returns
   */
  @Post("create")
  async create(
    @Body() { warehouseUuid, cover, name }: GoodsCreateDto,
    @Req() req: Request
  ) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const warehouse = await this.warehouseService.findOneByUuid(warehouseUuid);
    if (warehouse) {
      const member = await this.memberService.findOneByUserAndFamily(
        warehouse.family,
        user
      );
      if (
        warehouse.state === WarehouseStateEnum.PRIVATE &&
        member.type === MembersTypeEnum.MEMBER
      ) {
        throw new CustomException("非法操作");
      }
      if (member) {
        const list = await this.goodsService.findByWarehouse(warehouse);

        if (list.length === warehouse.capacity) {
          throw new CustomException(
            `只能创建${warehouse.capacity}个物品，如需添加更多物品，请联系客服`
          );
        }

        const goods = await this.goodsService.create({
          name,
          uuid: shortid.generate(),
          cover,
          warehouse,
          user,
        });
        return goods;
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  /**
   * 更新物品
   * @param cover
   * @param name
   * @param uuid
   * @param req
   * @returns
   */
  @Post("update")
  async update(
    @Body() { cover, name, uuid }: GoodsUpdateDto,
    @Req() req: Request
  ) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const goods = await this.goodsService.findOneByUuid(uuid);
    if (goods) {
      const warehouse = await this.warehouseService.findOneByUuid(
        goods.warehouse.uuid
      );
      const member = await this.memberService.findOneByUserAndFamily(
        warehouse.family,
        user
      );
      if (
        warehouse.state === WarehouseStateEnum.PRIVATE &&
        member.type === MembersTypeEnum.MEMBER
      ) {
        throw new CustomException("非法操作");
      }
      if (member) {
        await this.goodsService.update(uuid, {
          name,
          cover,
          warehouse,
          user,
        });
        return "ok";
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  /**
   * 使用物品
   * @param uuid
   * @param duration
   * @param req
   * @returns
   */
  @Post("use")
  async used(
    @Body() { uuid, duration }: GoodsUseDto,
    @Req()
    req: Request
  ) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const goods = await this.goodsService.findOneByUuid(uuid);
    if (goods) {
      const warehouse = await this.warehouseService.findOneByUuid(
        goods.warehouse.uuid
      );
      const member = await this.memberService.findOneByUserAndFamily(
        warehouse.family,
        user
      );
      if (member) {
        if (
          warehouse.state === WarehouseStateEnum.PRIVATE &&
          member.type === MembersTypeEnum.MEMBER
        ) {
          throw new CustomException("非法操作");
        }
        if (goods.state === GoodsEnum.NORMAL) {
          const useTimes = goods.useTimes + 1;
          await this.goodsService.useGoods(uuid, GoodsEnum.USED, useTimes);
          // 创建使用记录
          await this.usageLogService.create({
            uuid: shortid.generate(),
            useEndTime: new Date(
              Date.now() + 8 * 60 * 60 * 1000 + 1000 * duration
            ),
            state: UsageLogsEnum.USED,
            goods,
            user,
          });
          return "ok";
        } else {
          throw new CustomException("正在使用中");
        }
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  /**
   * 归还物品
   * @param uuid
   * @param req
   * @returns
   */
  @Post("return")
  async return(
    @Body() { uuid }: GoodsReturnDto,
    @Req()
    req: Request
  ) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const goods = await this.goodsService.findOneByUuid(uuid);
    if (goods) {
      const warehouse = await this.warehouseService.findOneByUuid(
        goods.warehouse.uuid
      );
      const member = await this.memberService.findOneByUserAndFamily(
        warehouse.family,
        user
      );
      if (member) {
        if (goods.state !== GoodsEnum.NORMAL) {
          const usageLog = await this.usageLogService.findOneyByGoodsAndUser(
            goods,
            user,
            UsageLogsEnum.RETURNED
          );
          if (usageLog) {
            // 更新物品状态
            await this.goodsService.return(uuid);
            // 更新归还记录
            await this.usageLogService.return(usageLog.uuid);
            if (usageLog.notice) {
              await this.noticeService.update({
                uuid: usageLog.notice.uuid,
                state: NoticesEnum.CANCEL,
                error: "提前归还",
              });
            }
            return "ok";
          } else {
            throw new CustomException("非法操作");
          }
        } else {
          throw new CustomException("未被使用");
        }
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  /**
   * 删除物品
   * @param uuid
   * @param req
   * @returns
   */
  @Post("delete")
  async delete(@Body() { uuid }: GoodsDeleteDto, @Req() req: Request) {
    const user: Users = await this.authService.getUser(
      req.headers["authorization"]
    );
    const goods = await this.goodsService.findOneByUuid(uuid);
    if (goods) {
      if (goods.state !== GoodsEnum.NORMAL) {
        throw new CustomException("使用中，不可删除");
      }
      const warehouse = await this.warehouseService.findOneByUuid(
        goods.warehouse.uuid
      );
      const member = await this.memberService.findOneByUserAndFamily(
        warehouse.family,
        user
      );
      if (member) {
        if (
          warehouse.state === WarehouseStateEnum.PRIVATE &&
          member.type === MembersTypeEnum.MEMBER
        ) {
          throw new CustomException("非法操作");
        }
        // 删除物品
        await this.goodsService.delete(uuid);
        return "ok";
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }
}
