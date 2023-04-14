import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import BaseEntity from "./base.entity";
import { UsageLogsEnum } from "@/common/enums";
import { Users, Goods, Notices } from "@/entitys";
@Entity()
export class UsageLogs extends BaseEntity {
  @PrimaryColumn({
    type: "varchar",
    comment: "主键ID",
  })
  uuid: string;

  @Column({
    type: "timestamp",
    comment: "使用结束时间",
    precision: 6,
  })
  public useEndTime: Date;

  @Column({
    type: "enum",
    comment: "记录的状态",
    enum: UsageLogsEnum,
    default: UsageLogsEnum.USED,
  })
  public state: UsageLogsEnum;

  @ManyToOne(() => Goods, (goods) => goods.usageLog)
  public goods: Goods;

  @ManyToOne(() => Users, (user) => user.usageLog)
  public user: Users;

  @OneToOne(() => Notices, (notice) => notice.usageLog) 
  @JoinColumn()
  public notice: Notices;
}
