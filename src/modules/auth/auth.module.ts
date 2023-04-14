import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { constants } from "./jwt.constants";
import { JwtStrategy } from "./jwt.strategy";
import { UserModule } from "@/modules/user/user.module";
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: constants.secret,
      signOptions: { expiresIn: "24h" },
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
