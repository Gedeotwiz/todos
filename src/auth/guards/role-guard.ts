import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserRole } from "src/--share--/dto/enum/user-role-enum";
import { ROLES_KEY } from "../decorator/roles.decorator";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || !requiredRoles.length) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    return requiredRoles.includes(user.role as UserRole);

  }
}
