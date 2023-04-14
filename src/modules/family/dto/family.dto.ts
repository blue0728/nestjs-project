import { IsNotEmpty, IsString } from "class-validator";

export class FamilyMemberDto {
  @IsNotEmpty({
    message: "familyUuid不能为空",
  })
  @IsString()
  readonly familyUuid: string;
}

export class FamilyJoinDto {
  @IsNotEmpty({
    message: "uuid不能为空",
  })
  @IsString()
  readonly uuid: string;
}

export class FamilyUpdateDto {
  @IsNotEmpty({
    message: "uuid不能为空",
  })
  @IsString()
  readonly uuid: string;

  @IsNotEmpty({
    message: "name不能为空",
  })
  @IsString()
  readonly name: string;
}

export class FamilyCreateDto {
  @IsNotEmpty({
    message: "name不能为空",
  })
  @IsString()
  readonly name: string;
}
