import { Column, Entity, PrimaryColumn, OneToMany, OneToOne } from "typeorm";
import { Members, Goods, UsageLogs, InviteLogs, Notices, Orders } from "@/entitys";
import BaseEntity from "./base.entity";

@Entity()
export class Users extends BaseEntity {
  @PrimaryColumn({
    type: "varchar",
    comment: "用户的openId",
  })
  public openid: string;

  @Column({
    type: "varchar",
    comment: "用户的unionId",
    default: "",
  })
  public unionid: string;

  @Column({
    type: "varchar",
    comment: "用户昵称",
    default: "",
  })
  public nickName: string; // name

  @Column({
    type: "varchar",
    comment: "用户头像",
    default: "",
  })
  public avatarUrl: string;

  @Column({
    type: "varchar",
    comment: "用户手机号码",
    default: "",
  })
  public phoneNumber: string;

  @Column({
    type: "int",
    comment: "最大拥有family个数",
    default: 5,
  })
  public maxNumber: number;

  @OneToMany(() => Members, (member) => member.user)
  public member: Members[];

  @OneToMany(() => Goods, (goods) => goods.user)
  public goods: Goods[];

  @OneToMany(() => UsageLogs, (usageLogs) => usageLogs.user)
  public usageLog: UsageLogs[];

  @OneToMany(() => InviteLogs, (inviteLog) => inviteLog.user)
  public inviteLog: InviteLogs[];

  @OneToMany(() => InviteLogs, (invitee) => invitee.user)
  public invitee: InviteLogs[];

  @OneToMany(() => Notices, (notice) => notice.user)
  public notice: Notices[];

  @OneToMany(() => Orders, (order) => order.user)
  public order: Orders[];
}
