import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";

abstract class BaseEntity {
  @CreateDateColumn({
    type: "timestamp",
    comment: "创建时间",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    comment: "更新时间",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: "timestamp",
    comment: "删除时间",
  })
  deleteAt: Date;
}

export default BaseEntity;
