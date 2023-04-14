import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride("isPublic", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const isProtected = this.reflector.getAllAndOverride("isProtected", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (
      isProtected != undefined &&
      isProtected === context.switchToHttp().getRequest().query.token &&
      !context.switchToHttp().getRequest().headers["authorization"]
    ) {
      return true;
    }

    return super.canActivate(context);
  }
}
