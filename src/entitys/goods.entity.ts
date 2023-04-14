import { Column, Entity, PrimaryColumn, ManyToOne, OneToMany } from "typeorm";
import BaseEntity from "./base.entity";
import { GoodsEnum } from "@/common/enums";
import { UsageLogs, Warehouses, Users, Notices } from "@/entitys";

@Entity()
export class Goods extends BaseEntity {
  @PrimaryColumn({
    type: "varchar",
    comment: "物品的uuid",
  })
  public uuid: string;

  @Column({
    type: "varchar",
    comment: "物品的名称",
  })
  public name: string;

  @Column({
    type: "varchar",
    comment: "物品的封面",
    default: "",
  })
  public cover: string;

  @Column({
    type: "int",
    comment: "物品使用次数",
    default: 0,
  })
  public useTimes: number;

  @Column({
    type: "enum",
    comment: "物品的状态",
    enum: GoodsEnum,
    default: GoodsEnum.NORMAL,
  })
  public state: GoodsEnum;

  @ManyToOne(() => Users, (user) => user.goods)
  public user: Users;

  @ManyToOne(() => Warehouses, (warehouse) => warehouse.goods)
  public warehouse: Warehouses;

  @OneToMany(() => UsageLogs, (usageLog) => usageLog.goods)
  public usageLog: UsageLogs[];

  @OneToMany(() => Notices, (notice) => notice.goods)
  public notice: Notices[];
}
