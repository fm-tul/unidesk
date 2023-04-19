import { createContext } from "react";

import { UserWhoamiDto, UserFunction, EnvironmentType } from "../api-client";

export const userGuest: UserWhoamiDto = {
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
  environment: EnvironmentType.LOCAL,
};

export interface IUserContext {
  user: UserWhoamiDto;
  setUser: (user: UserWhoamiDto) => void;
  resetUser: () => void;
}

export const defaultContext = {
  user: userGuest,
  setUser: (user: UserWhoamiDto) => {
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
