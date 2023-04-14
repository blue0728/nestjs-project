import { NoticeMiniprogramStateEnum } from "@/common/enums";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class NoticesCreateDto {
  @IsNotEmpty({
    message: "goodsUuid必填",
  })
  @IsString()
  readonly goodsUuid: string;

  @IsEnum(NoticeMiniprogramStateEnum)
  readonly miniprogram_state: NoticeMiniprogramStateEnum;
}
