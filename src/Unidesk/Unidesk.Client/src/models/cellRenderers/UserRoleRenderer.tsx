import { UserRoleDto } from "@models/UserRoleDto";

export const renderUserRole = (userRole: UserRoleDto) => {
  return <span>{userRole.name}</span>;
};
