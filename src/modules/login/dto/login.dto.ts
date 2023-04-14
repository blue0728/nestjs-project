import { IsNotEmpty, IsString } from "class-validator";

export class LoginSigninDto {
  @IsNotEmpty({
    message: "code必填",
  })
  @IsString()
  readonly code: string;
}
