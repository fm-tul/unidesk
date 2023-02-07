import { Grants } from "@api-client/constants/Grants";
import { UserDto } from "@models/UserDto";

type GrantsEnum = typeof Grants[keyof typeof Grants];
export const hasSomeGrant = (me: UserDto, ...grants: GrantsEnum[]) => {
  const { grantIds = [] } = me ?? {};
  return grants.some(g => grantIds.includes(g.id));
};

