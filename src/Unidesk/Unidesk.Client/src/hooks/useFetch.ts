import { CancelablePromise, QueryFilter } from "@api-client";
import { SimpleJsonResponse } from "@models/SimpleJsonResponse";
import { DependencyList, useEffect, useState } from "react";

import { PagedResponse } from "components/Paging";

import { usePaging } from "./usePaging";
import { useRefresh } from "./useRefresh";

export const useFetch = <T>(func: () => Promise<T>, deps: DependencyList = []) => {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  useEffect(() => {
    setIsLoading(true);
    func()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, deps);


  return { isLoading, data, error };
};

export const useDelayedFetch = <T>(func: () => Promise<T>, deps: DependencyList = []) => {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  const doRequest = async () => {
    setIsLoading(true);
    setData(undefined);
    func()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  return { isLoading, data, error, doRequest };
};

export const useGetSetDeleteFetch = <T>(
  getAll: () => Promise<T[]>,
  upsertOne: () => Promise<T>,
  deleteOne: () => Promise<SimpleJsonResponse>,
  deps: DependencyList = []
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<any>();

  const [data, setData] = useState<T[]>();
  const [savedData, setSavedData] = useState<T>();
  const [deletedData, setDeletedData] = useState<any>();

  const loadData = async () => {
    setIsLoading(true);
    getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    loadData();
  }, deps);

  const deleteItem = async () => {
    return new Promise((resolve, reject) => {
      setIsDeleting(true);
      deleteOne()
        .then(i => {
          setDeletedData(i);
          resolve(i);
          setError(undefined);
        })
        .catch(i => {
          setError(i);
          reject(i);
        })
        .finally(() => setIsDeleting(false));
    });
  };

  const saveItem = async () => {
    return new Promise((resolve, reject) => {
      setIsSaving(true);
      upsertOne()
        .then(i => {
          setSavedData(i);
          resolve(i);
          setError(undefined);
        })
        .catch(i => {
          setError(i);
          reject(i);
        })
        .finally(() => setIsSaving(false));
    }) as Promise<T>;
  };

  return {
    // loading flags
    isLoading,
    isSaving,
    isDeleting,
    // data flags
    data,
    savedData,
    deletedData,
    // methods to call manually
    saveItem,
    deleteItem,
    loadData,
    // error
    error,
  };
};

export const useQuery = <T>(initialValue?: Partial<QueryFilter>) => {
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const { filter, setFilter } = usePaging(initialValue);
  const { refresh, refreshIndex } = useRefresh();

  const loadData = async (promise: Promise<PagedResponse<T>> | CancelablePromise<PagedResponse<T>>) => {
    setIsLoading(true);
    promise
      .then((i: PagedResponse<T>) => {
        setData(i.items);
        setFilter(i.filter);
        setError(undefined);
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  return {
    isLoading,
    data,
    error,
    filter,
    refreshIndex,
    refresh,
    setFilter,
    loadData,
  };
};

export const toPromiseArray = <T>(promise: Promise<PagedResponse<T>>): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    promise
      .then((i: PagedResponse<T>) => {
        resolve(i.items);
      })
      .catch(reject);
  });
};


export const useSingleQuery = <T>() => {
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T>();

  const loadData = async (promise: Promise<T>) => {
    setIsLoading(true);
    promise
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  return {
    isLoading,
    data,
    error,
    loadData,
  };
}