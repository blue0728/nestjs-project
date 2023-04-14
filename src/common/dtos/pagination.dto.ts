import { IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: "页码",
  })
  page: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: "每页数量",
  })
  pageSize: number;
}
