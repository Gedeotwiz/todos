

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export function getUserRole(role: string): UserRole {
  switch (role.toUpperCase()) {
    case "USER":
      return UserRole.USER;
    case "ADMIN":
      return UserRole.ADMIN;
    default:
      return UserRole.USER;
  }
}

