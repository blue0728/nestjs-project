import {
  Column,
  Entity,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import BaseEntity from "./base.entity";
import { NoticeMiniprogramStateEnum, NoticesEnum } from "@/common/enums";
import { Users, Goods, UsageLogs } from "@/entitys";

@Entity()
export class Notices extends BaseEntity {
  @PrimaryColumn({
    type: "varchar",
    comment: "通知的uuid",
  })
  public uuid: string;

  @Column({
    type: "enum",
    comment: "发送状态",
    enum: NoticesEnum,
    default: NoticesEnum.UNPUSH,
  })
  public state: NoticesEnum;

  @Column({
    type: "varchar",
    comment: "错误信息",
    default: ''
  })
  public error: string;

  @Column({
    type: "varchar",
    comment: "template_id订阅消息模板id",
  })
  public template_id: string;

  @Column({
    type: "enum",
    comment: "小程序版本",
    enum: NoticeMiniprogramStateEnum,
    default: NoticeMiniprogramStateEnum.FORMAL,
  })
  public miniprogram_state: string;

  @ManyToOne(() => Users, (user) => user.notice)
  public user: Users;

  @ManyToOne(() => Goods, (goods) => goods.notice)
  public goods: Goods;

  @OneToOne(() => UsageLogs, (usageLog) => usageLog.notice)
  @JoinColumn()
  public usageLog: UsageLogs;
}
