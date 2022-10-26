import { createContext } from "react";

import { UserDto, UserFunction } from "../api-client";

export const userGuest: UserDto = {
  id: "00000000-0000-0000-0000-000000000000",
  username: "guest",
  grantIds: [] as string[],
  created: "0001-01-01T00:00:00",
  modified: "0001-01-01T00:00:00",
  userFunction: UserFunction.NONE,
  teams: [],
  userInTeams: [],
};

export const defaultContext = {
  user: userGuest,
  setUser: (user: UserDto) => {
    console.log("DBG setUser", user);
    debugger;
  },
  resetUser: () => {
    console.log("DBG resetUser");
    debugger;
  },
};

export const UserContext = createContext(defaultContext);
