import { QueryPaging } from "@models/QueryPaging";
import { useState } from "react";

import { useLocalStorage } from "./useLocalStorage";

const initialQueryFilter: QueryPaging = {
  page: 1,
  pageSize: 20,

  orderBy: null,
  orderAscending: false,
  total: -1,
};

export interface PagingModel {
  paging: QueryPaging;
  setPaging: React.Dispatch<React.SetStateAction<QueryPaging>>;
}

export const usePaging = (initialValue?: Partial<QueryPaging>, persistKey?: string): PagingModel => {
  const [paging, setPaging] = persistKey
    ? useLocalStorage(persistKey, { ...initialQueryFilter, ...initialValue })
    : useState({ ...initialQueryFilter, ...initialValue });

  return { paging, setPaging };
};
