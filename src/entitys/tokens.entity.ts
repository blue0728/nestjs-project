import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import BaseEntity from "./base.entity";

@Entity()
export class Tokens extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "主键ID",
  })
  id: number;

  @Column({
    type: "varchar",
    comment: "微信小程序access_token",
  })
  public access_token: string;

  @Column({
    type: "timestamp",
    comment: "access_token的过期时间",
    precision: 6
  })
  public expires_in: Date;
}
