import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import BaseEntity from "./base.entity";
import { Familys } from "./familys.entity";
import { Goods } from "./goods.entity";
import { WarehouseStateEnum } from "@/common/enums";

@Entity()
export class Warehouses extends BaseEntity {
  @PrimaryColumn({
    type: "varchar",
    comment: "仓库的uuid",
  })
  public uuid: string;

  @Column({
    type: "varchar",
    comment: "仓库的名称",
  })
  public name: string;

  @Column({
    type: "varchar",
    comment: "仓库的封面",
    default: "",
  })
  public cover: string;

  @Column({
    type: "int",
    comment: "仓库容量",
    default: 20,
  })
  public capacity: number;

  @Column({
    type: "enum",
    comment: "仓库的状态",
    enum: WarehouseStateEnum,
    default: WarehouseStateEnum.PUBLIC,
  })
  public state: WarehouseStateEnum;

  @ManyToOne(() => Familys, (family) => family.warehouse)
  public family: Familys;

  @OneToMany(() => Goods, (goods) => goods.warehouse)
  public goods: Goods[];
}
