import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import BaseEntity from "./base.entity";
import { InviteLogsEnum } from "@/common/enums";
import { Users } from "./users.entity";
import { Familys } from "./familys.entity";

@Entity()
export class InviteLogs extends BaseEntity {
  @PrimaryColumn({
    type: "varchar",
    comment: "主键ID",
  })
  uuid: string;

  @Column({
    type: "enum",
    comment: "邀请记录的状态",
    enum: InviteLogsEnum,
    default: InviteLogsEnum.NORMAL,
  })
  public state: InviteLogsEnum;

  @ManyToOne(() => Users, (user) => user.inviteLog)
  public user: Users;

  @ManyToOne(() => Familys, (family) => family.inviteLog)
  public family: Familys;

  @ManyToOne(() => Users, (invitee) => invitee.inviteLog)
  public invitee: Users;
}
