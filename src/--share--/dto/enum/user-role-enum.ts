
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export function getUserRole(role?: string): UserRole {
  if (!role) return UserRole.USER; 
  switch (role.toUpperCase()) {
    case "ADMIN":
      return UserRole.ADMIN;
    case "USER":
      return UserRole.USER;
    default:
      return UserRole.USER;
  }
}
