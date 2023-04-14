import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import BaseEntity from "./base.entity";
import { InviteLogs } from "./inviteLogs.entity";
import { Members } from "./members.entity";
import { Warehouses } from "./warehouses.entity";

@Entity()
export class Familys extends BaseEntity {
  @PrimaryColumn({
    type: "varchar",
    comment: "家的uuid",
  })
  public uuid: string;

  @Column({
    type: "varchar",
    comment: "家的名称",
  })
  public name: string;

  @Column({
    type: "int",
    comment: "家庭容量",
    default: 5,
  })
  public capacity: number;

  @OneToMany(() => Members, (members) => members.family)
  member: Members[];

  @OneToMany(() => Warehouses, (warehouse) => warehouse.family)
  warehouse: Warehouses[];

  @OneToMany(() => Warehouses, (inviteLogs) => inviteLogs.family)
  inviteLog: InviteLogs[];
}
