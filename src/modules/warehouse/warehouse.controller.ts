import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { AuthService } from "@/modules/auth/auth.service";
import { FamilyService } from "@/modules/family/family.service";
import { MemberService } from "@/modules/member/member.service";
import { WarehouseService } from "@/modules/warehouse/warehouse.service";
import { GoodsService } from "@/modules/goods/goods.service";
import { CustomException } from "@/common/http/customException";
import { Request } from "express";
import { Users } from "@/entitys";
import * as shortid from "shortid";
import {
  WarehouseCreateDto,
  WarehouseDeleteDto,
  WarehouseListDto,
  WarehouseUpdateDto,
} from "./dto/warehouse.dto";
import { GoodsEnum, MembersTypeEnum } from "@/common/enums";
@Controller("warehouse")
export class WarehouseController {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly authService: AuthService,
    private readonly memberService: MemberService,
    private readonly familyService: FamilyService,
    private readonly goodsService: GoodsService
  ) {}
  @Get("list")
  async list(@Query() { familyUuid }: WarehouseListDto, @Req() req: Request) {
    const user = await this.authService.getUser(req.headers["authorization"]);
    const family = await this.familyService.findOneByUuid(familyUuid);
    if (family) {
      const member = await this.memberService.findOneByUserAndFamily(
        family,
        user
      );
      if (member) {
        const warehouse = await this.warehouseService.findAllByFamily(family);
        return warehouse;
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  @Post("create")
  async create(
    @Body() { name, familyUuid, cover, state }: WarehouseCreateDto,
    @Req() req: Request
  ) {
    const user = await this.authService.getUser(req.headers["authorization"]);
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
        const warehouses = await this.warehouseService.findAllByFamily(family);

        if(warehouses.length === family.capacity){
          throw new CustomException(`只能创建${family.capacity}个储物室，如需更多储物室，请联系客服`)
        }

        const res = await this.warehouseService.create({
          name,
          uuid: shortid.generate(),
          cover,
          family,
          state,
        });
        return res;
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  @Post("update")
  async update(
    @Body() { uuid, name, cover }: WarehouseUpdateDto,
    @Req() req: Request
  ) {
    const warehouse = await this.warehouseService.findOneByUuid(uuid);
    if (warehouse) {
      const user = await this.authService.getUser(req.headers["authorization"]);
      const member = await this.memberService.findOneByUserAndFamily(
        warehouse.family,
        user
      );

      if (member) {
        if (member.type === MembersTypeEnum.MEMBER) {
          throw new CustomException("非法操作");
        }
        await this.warehouseService.update(uuid, {
          name,
          cover,
        });
        return "ok";
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  @Get("delete")
  async delete(@Query() { uuid }: WarehouseDeleteDto, @Req() req: Request) {
    const user: Users = await this.authService.getUser(
      req.headers["authorization"]
    );
    const warehouse = await this.warehouseService.findOneByUuid(uuid);
    if (warehouse) {
      await this.memberService.findOneByUserAndFamily(warehouse.family, user);
      const member = await this.memberService.findOneByUserAndFamily(
        warehouse.family,
        user
      );
      if (member) {
        if (member.type === MembersTypeEnum.MEMBER) {
          throw new CustomException("非法操作");
        }
        const goods = await this.goodsService.findByWarehouse(warehouse);
        if (goods.length) {
          throw new CustomException("不可删除，请先清空");
        }
        // 删除仓库
        await this.warehouseService.delete(uuid);
        return goods;
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }

  @Get("clear")
  async clear(@Query() { uuid }: WarehouseDeleteDto, @Req() req: Request) {
    const user: Users = await this.authService.getUser(
      req.headers["authorization"]
    );
    const warehouse = await this.warehouseService.findOneByUuid(uuid);
    if (warehouse) {
      await this.memberService.findOneByUserAndFamily(warehouse.family, user);
      const member = await this.memberService.findOneByUserAndFamily(
        warehouse.family,
        user
      );
      if (member) {
        if (member.type === MembersTypeEnum.MEMBER) {
          throw new CustomException("非法操作");
        }
        const goods = await this.goodsService.findByWarehouse(warehouse);
        let useGoods = [];
        if (goods.length) {
          const uuids = goods
            .filter((item) => item.state === GoodsEnum.NORMAL)
            .map((item) => item.uuid) as [];
          await this.goodsService.batchDelete(uuids);

          useGoods = goods.filter((item) => item.state !== GoodsEnum.NORMAL);
        }
        return {
          data: useGoods,
          message: "清除成功",
        };
      } else {
        throw new CustomException("非法操作");
      }
    } else {
      throw new CustomException("结果不存在");
    }
  }
}
