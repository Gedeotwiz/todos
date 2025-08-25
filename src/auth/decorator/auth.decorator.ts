import { JwtGuard } from "../guards/jwt-guard";
import { UserRole } from "src/--share--/dto/enum/user-role-enum";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UseGuards,Type } from "@nestjs/common";
import { Authguard } from "../guards/auth.guard";
import { applyDecorators} from "@nestjs/common";
import { AllowRoles } from "./roles.decorator";
import { CanActivate } from "@nestjs/common/interfaces";





function Authorize(guard: Type<CanActivate>, ...roles: UserRole[]) {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(guard, Authguard ),
    AllowRoles(...roles),
  );
}


export function IsAdmin() {
  return Authorize(JwtGuard, UserRole.ADMIN);
}

export function IsUser() {
  return Authorize(JwtGuard, UserRole.USER);
}

export function IsAdminOrUser(){
    return Authorize(JwtGuard, UserRole.USER || UserRole.ADMIN);
}