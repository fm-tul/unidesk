import { createContext } from "react";

import { UserDto, UserFunction } from "../api-client";

export const userGuest: UserDto = {
  id: "00000000-0000-0000-0000-000000000000",
  username: "guest",
  grantIds: [] as string[],
  roles: [],
  created: "0001-01-01T00:00:00",
  modified: "0001-01-01T00:00:00",
  userFunction: UserFunction.NONE,
  teams: [],
  aliases: [],
  allThesis: [],
};

export interface IUserContext {
  user: UserDto;
  setUser: (user: UserDto) => void;
  resetUser: () => void;
}

export const defaultContext = {
  user: userGuest,
  setUser: (user: UserDto) => {
    console.log("DBG setUser", user);
    debugger;
    throw new Error("setUser not implemented");
  },
  resetUser: () => {
    console.log("DBG resetUser");
    debugger;
    throw new Error("resetUser not implemented");
  },
};

export const UserContext = createContext<IUserContext>(defaultContext);
