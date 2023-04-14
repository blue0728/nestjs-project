import {
  Column,
  Entity,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import BaseEntity from "./base.entity";
import { OrderStateEnum } from "@/common/enums";
import { Users, Goods, UsageLogs } from "@/entitys";

@Entity()
export class Orders extends BaseEntity {
  @PrimaryColumn({
    type: "varchar",
    comment: "订单的uuid",
  })
  public uuid: string;

  @Column({
    type: "varchar",
    comment: "商品描述",
    default: "",
  })
  public description: string;

  @Column({
    type: "int",
    comment: "订单价格",
  })
  public amount: number;

  @Column({
    type: "varchar",
    comment: "预支付订单号",
  })
  public prepay_id: string;

  @ManyToOne(() => Users, (user) => user.order)
  public user: Users;

  @Column({
    type: "enum",
    comment: "订单状态",
    enum: OrderStateEnum,
    default: OrderStateEnum.UNPAID,
  })
  public state: OrderStateEnum;
}
