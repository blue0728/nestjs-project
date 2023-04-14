import { IsString, IsOptional, IsNotEmpty } from "class-validator";
import { WarehouseStateEnum } from "@/common/enums";

export class WarehouseListDto {
  @IsNotEmpty({
    message: "familyUuid必填",
  })
  @IsString()
  readonly familyUuid: string;
}

export class WarehouseCreateDto {
  @IsNotEmpty({
    message: "name必填",
  })
  @IsString()
  readonly name: string;

  @IsNotEmpty({
    message: "familyUuid必填",
  })
  @IsString()
  readonly familyUuid: string;

  @IsNotEmpty({
    message: "cover必填",
  })
  @IsString()
  readonly cover: string;

  @IsOptional()
  readonly state?: WarehouseStateEnum;
}

export class WarehouseUpdateDto {
  @IsNotEmpty({
    message: "name必填",
  })
  @IsString()
  readonly name: string;

  @IsNotEmpty({
    message: "uuid必填",
  })
  @IsString()
  readonly uuid: string;

  @IsNotEmpty({
    message: "cover必填",
  })
  @IsString()
  readonly cover: string;
}

export class WarehouseDeleteDto {
  @IsNotEmpty({
    message: "uuid不能为空",
  })
  @IsString()
  readonly uuid: string;
}
