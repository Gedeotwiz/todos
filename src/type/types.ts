import { UserRole } from "src/--share--/dto/enum/user-role-enum";

export interface IJwtPayload { id: string; sub: string; role: UserRole; }