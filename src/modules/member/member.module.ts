import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MemberService } from "./member.service";
import { MemberController } from "./member.controller";
import { AuthModule } from "@/modules/auth/auth.module";
import { FamilyModule } from "@/modules/family/family.module";
import { UserModule } from "@/modules/user/user.module";
import { Members } from "@/entitys";

@Module({
  imports: [
    UserModule,
    forwardRef(() => FamilyModule),
    AuthModule,
    TypeOrmModule.forFeature([Members]),
  ],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
