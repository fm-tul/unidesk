import { QueryFilter } from "@models/QueryFilter";
import { useState } from "react";

import { useLocalStorage } from "./useLocalStorage";

const initialQueryFilter: QueryFilter = {
    page: 1,
    pageSize: 20,
    
    orderBy: undefined,
    orderAscending: undefined,
    total: -1
}

export const usePaging = (initialValue?: Partial<QueryFilter>, persistKey?: string) => {
    const [filter, setFilter] = persistKey 
        ? useLocalStorage(persistKey, {...initialQueryFilter, ...initialValue})
        : useState({...initialQueryFilter, ...initialValue})

    return {
        filter, setFilter
    }
}