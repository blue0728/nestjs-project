import { PaginationDto } from "@/common/dtos";
import { Type } from "class-transformer";
import { IsString, IsOptional, IsNumber, IsNotEmpty } from "class-validator";

export class GoodsListDto extends PaginationDto {}

export class GoodsListBywarehouseDto extends PaginationDto {
  @IsNotEmpty({
    message: "warehouseUuid必填",
  })
  @IsString()
  readonly warehouseUuid: string;
}

export class GoodsDetailsDto {
  @IsNotEmpty({
    message: "uuid必填",
  })
  @IsString()
  readonly uuid: string;
}

export class GoodsSearchDto extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly keyword: string;

  @IsOptional()
  @IsString()
  readonly familyUuid: string;

  @IsOptional()
  @IsString()
  readonly warehouseUuid: string;
}

export class GoodsCreateDto {
  @IsOptional()
  @IsString()
  readonly cover: string;

  @IsNotEmpty({
    message: "name必填",
  })
  @IsString()
  readonly name: string;

  @IsNotEmpty({
    message: "warehouseUuid必填",
  })
  @IsString()
  readonly warehouseUuid: string;
}

export class GoodsUpdateDto {
  @IsOptional()
  @IsString()
  readonly cover: string;

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
}

export class GoodsUseDto {
  @Type(() => Number)
  @IsNumber()
  readonly duration: number;

  @IsNotEmpty({
    message: "uuid必填",
  })
  @IsString()
  readonly uuid: string;
}

export class GoodsReturnDto {
  @IsNotEmpty({
    message: "uuid必填",
  })
  @IsString()
  readonly uuid: string;
}

export class GoodsDeleteDto {
  @IsNotEmpty({
    message: "uuids必填",
  })
  @IsString()
  readonly uuid: string;
}

export class GoodsBatchDeleteDto {
  @IsNotEmpty({
    message: "uuids必填",
  })
  @IsString()
  readonly uuids: string;
}
