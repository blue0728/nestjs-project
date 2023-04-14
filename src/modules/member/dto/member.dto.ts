import { MembersTypeEnum } from "@/common/enums";
import { IsString, IsEnum, IsNotEmpty } from "class-validator";

export class MemberLeaveDto {
  @IsNotEmpty({
    message: "familyUuid必填",
  })
  @IsString()
  readonly familyUuid: string;
}

export class MemberRemoveDto {
  @IsNotEmpty({
    message: "familyUuid必填",
  })
  @IsString()
  readonly familyUuid: string;

  @IsNotEmpty({
    message: "userOpenid必填",
  })
  @IsString()
  readonly userOpenid: string;
}

export class MemberUpdateDto {
  @IsNotEmpty({
    message: "familyUuid必填",
  })
  @IsString()
  readonly familyUuid: string;

  @IsNotEmpty({
    message: "userOpenid必填",
  })
  @IsString()
  readonly userOpenid: string;

  @IsEnum(MembersTypeEnum)
  readonly type: MembersTypeEnum;
}
