import { PaginationDto } from "@/common/dtos";
import { InviteLogsEnum } from "@/common/enums";
import { Type } from "class-transformer";
import { IsOptional, IsEnum, IsString, IsNotEmpty } from "class-validator";

export class InviteLogListDto extends PaginationDto {
  @IsOptional()
  @IsEnum(InviteLogsEnum)
  @Type(() => Number)
  readonly state?: InviteLogsEnum;
}


export class InviteLogDetailsDto {
  @IsNotEmpty({
    message: "uuid必填",
  })
  @IsString()
  readonly uuid: string
}