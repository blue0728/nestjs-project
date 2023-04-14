import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class OrdersCreateDto {
  @IsNotEmpty({
    message: "金额不能为空",
  })
  @Type(() => Number)
  @IsNumber()
  readonly amount: number;
}
