import { createContext } from "react";
import { UserDto } from "../api-client";

export const userGuest: UserDto = {
  id: "00000000-0000-0000-0000-000000000000",
  username: "guest",
  grants: [] as string[],
  created: "0001-01-01T00:00:00",
  modified: "0001-01-01T00:00:00",
};

export const defaultContext = {
  user: userGuest,
  setUser: (user: UserDto) => {},
  resetUser: () => {},
};

export const UserContext = createContext(defaultContext);
