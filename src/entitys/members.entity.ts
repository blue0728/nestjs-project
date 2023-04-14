import { Column, Entity, PrimaryColumn, ManyToOne, Index } from "typeorm";
import BaseEntity from "./base.entity";
import { MembersTypeEnum } from "@/common/enums";
import { Users } from "./users.entity";
import { Familys } from "./familys.entity";

@Entity()
export class Members extends BaseEntity {
  @PrimaryColumn({
    type: "varchar",
    comment: "用户的uuid",
  })
  public uuid: string;

  @Column({
    type: "enum",
    comment: "成员类型",
    enum: MembersTypeEnum,
    default: MembersTypeEnum.MEMBER,
  })
  public type: MembersTypeEnum;

  @ManyToOne(() => Users, (user) => user.member)
  public user: Users;

  @ManyToOne(() => Familys, (family) => family.member)
  public family: Familys;
}
