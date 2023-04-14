import { SetMetadata } from "@nestjs/common";
import { protectedToken } from "@/common/constants/protected.token";

export const Protected = () => SetMetadata("isProtected", protectedToken);
