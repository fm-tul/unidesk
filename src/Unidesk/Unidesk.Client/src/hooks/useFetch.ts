import { QueryPaging } from "@api-client";
import { SimpleJsonResponse } from "@models/SimpleJsonResponse";
import { DependencyList, useState } from "react";

import { PagedResponse } from "components/Paging";

import { PagingModel } from "./usePaging";
import { useMutation, useQuery } from "react-query";

export const useModel = <T>(
  getFunc: () => Promise<T>,
  setFunc: (data: T) => Promise<T>,
  deleteFunc: (id: string) => Promise<SimpleJsonResponse>,
  deps: DependencyList = []
) => {
  const [data, setData] = useState<T>();
  const getQuery = useQuery({
    queryKey: deps,
    queryFn: getFunc,
    onSuccess: setData,
  });

  const setQuery = useMutation(setFunc, {
    onSuccess: setData,
  });

  const deleteQuery = useMutation(deleteFunc, {
    onSuccess: () => setData(undefined),
  });

  const isLoading = getQuery.isLoading || setQuery.isLoading || deleteQuery.isLoading;
  const error = getQuery.error || setQuery.error || deleteQuery.error;

  return {
    data,
    isLoading,
    error,
    setData,
    getQuery,
    setQuery,
    deleteQuery,
  };
};

export const useListModel = <T>(
  getFunc: () => Promise<T[]>,
  setFunc: (data: T) => Promise<T>,
  deleteFunc: (id: string) => Promise<SimpleJsonResponse>,
  deps: DependencyList = []
) => {
  const [data, setData] = useState<T[]>();
  const getQuery = useQuery({
    queryKey: deps,
    queryFn: getFunc,
    onSuccess: setData,
  });

  const setQuery = useMutation(setFunc, {
    onSuccess: () => {
      getQuery.refetch();
    },
  });

  const deleteQuery = useMutation(deleteFunc, {
    onSuccess: () => {
      getQuery.refetch();
    },
  });

  const isLoading = getQuery.isLoading || setQuery.isLoading || deleteQuery.isLoading;
  const error = getQuery.error || setQuery.error || deleteQuery.error;

  return {
    data,
    isLoading,
    error,
    setData,
    getQuery,
    setQuery,
    deleteQuery,
  };
};

type TFilterWithPaging = { paging?: QueryPaging | undefined };
export interface PagedQueryProps<TItem, TFilter> {
  queryFn: ({requestBody}: {requestBody: TFilter}) => Promise<PagedResponse<TItem>>
  pageModel: PagingModel;
  filter: TFilter;
  onChange?: (data: TItem[]) => void;
  queryKey?: DependencyList;
}

export const usePagedQuery = <TItem, TFilter extends TFilterWithPaging>(
  props: PagedQueryProps<TItem, TFilter>) => {
  const { pageModel, filter, onChange, queryFn, queryKey = [] } = props;
  const [data, setData] = useState<TItem[]>([]);
  const getQuery = useQuery({
    queryKey: [...queryKey, pageModel.paging?.page, pageModel.paging?.pageSize, pageModel.paging?.orderBy, pageModel.paging?.orderAscending],
    keepPreviousData: true,
    queryFn: () => queryFn({ requestBody: { ...filter, paging: pageModel.paging } }),
    onSuccess: (i: PagedResponse<TItem>) => {
      setData(i.items);
      pageModel.setPaging(i.paging);
      onChange?.(i.items);
    },
  });

  return {
    data,
    setData,
    getQuery,
    isLoading: getQuery.isLoading || getQuery.isFetching,
    refresh: () => getQuery.refetch(),
  };
};


export const extractPagedResponse = <T>(promise: Promise<PagedResponse<T>>): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    promise
      .then((i: PagedResponse<T>) => {
        resolve(i.items);
      })
      .catch(reject);
  });
};
