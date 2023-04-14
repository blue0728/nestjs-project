import { PaginationDto } from "@/common/dtos";
import { IsNotEmpty, IsString } from "class-validator";

export class UsageLogsListDto extends PaginationDto {}

export class UsageLogsDetailsDto {
  @IsNotEmpty({
    message: "uuid必填",
  })
  @IsString()
  readonly uuid: string;
}
