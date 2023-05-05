import { QueryPaging } from "@api-client";
import { SimpleJsonResponse } from "@models/SimpleJsonResponse";
import { DependencyList, useState } from "react";

import { PagedResponse } from "components/Paging";

import { PagingModel } from "./usePaging";
import { useMutation, useQuery } from "react-query";
import { GUID_EMPTY } from "@core/config";
import { ZodObject } from "zod";
import { FormErrors, extractErrors, useDto } from "utils/forms";
import { TranslateFunc } from "@locales/translationHooks";
import { toast } from "react-toastify";

export const useModel = <T>(
  id: string,
  initialValues: Partial<T>,
  getFunc: () => Promise<T>,
  setFunc: (data: T) => Promise<T>,
  deleteFunc: (id: string) => Promise<SimpleJsonResponse>,
  deps: DependencyList = [],
  schema: ZodObject<any> | undefined = undefined,
  autoValidate = false,
  onSuccess?: (data: T) => void
) => {
  // const [data, setData] = useState<T>();
  const { dto, setDto, getPropsText, getPropsSelect, errors, setErrors, validateSafe, validateAndSetErrors, getHelperProps } = useDto<T>(
    initialValues,
    schema,
    autoValidate
  );
  const getQuery = useQuery({
    queryKey: deps,
    queryFn: getFunc,
    onSuccess: setDto,
    enabled: !!id && id !== GUID_EMPTY && id !== "new",
  });

  const setQuery = useMutation(setFunc, {
    onSuccess: (data: T) => {
      setDto(data);
      onSuccess?.(data);
    },
    onError: (e: any) => {
      setErrors(extractErrors(e));
    },
  });

  const deleteQuery = useMutation(deleteFunc, {
    onSuccess: () => setDto(undefined),
  });

  const isLoading = getQuery.isLoading || setQuery.isLoading || deleteQuery.isLoading;
  const error = getQuery.error || setQuery.error || deleteQuery.error;

  return {
    dto,
    isLoading,
    error,
    setDto,
    getQuery,
    setQuery,
    deleteQuery,
    getPropsText,
    getPropsSelect,
    getHelperProps,
    errors,
    setErrors,
    validateSafe,
    validateAndSetErrors,
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
  queryFn: ({ requestBody }: { requestBody: TFilter }) => Promise<PagedResponse<TItem>>;
  pageModel: PagingModel;
  filter: TFilter;
  onChange?: (data: TItem[]) => void;
  queryKey?: DependencyList;
}

export const usePagedQuery = <TItem, TFilter extends TFilterWithPaging>(props: PagedQueryProps<TItem, TFilter>) => {
  const { pageModel, filter, onChange, queryFn, queryKey = [] } = props;
  const [data, setData] = useState<TItem[]>([]);
  const getQuery = useQuery({
    queryKey: [
      ...queryKey,
      pageModel.paging?.page,
      pageModel.paging?.pageSize,
      pageModel.paging?.orderBy,
      pageModel.paging?.orderAscending,
    ],
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

interface UseModelOptions<T> {
  id?: string;
  initialValues: T;
  deps?: DependencyList;

  translate?: TranslateFunc;
  autoToaster?: boolean;
  getFunc?: () => Promise<T>;
  setFunc?: (data: T) => Promise<T>;
  delFunc?: (id: string) => Promise<SimpleJsonResponse>;

  onGetSuccess?: (data: T) => void;
  onSetSuccess?: (data: T) => void;
  onDelSuccess?: (data: unknown) => void;

  onGetError?: (error: SimpleJsonResponse) => void;
  onSetError?: (error: SimpleJsonResponse) => void;
  onDelError?: (error: SimpleJsonResponse) => void;
}
export const useModelQuery = <T>(options: UseModelOptions<T>) => {
  const { getFunc, setFunc, delFunc } = options;
  const { id, deps = [], initialValues, translate, autoToaster } = options;
  const { onGetSuccess, onSetSuccess, onDelSuccess } = options;
  const { onGetError, onSetError, onDelError } = options;

  const [dto, setDto] = useState<T>(initialValues);
  const [touched, setTouched] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors<T>>({});

  const updateDtoFromServer = (data: T) => {
    setDto(data);
    setErrors({});
    setTouched(false);
  };

  const changeDto = (data: T) => {
    setDto(data);
    setTouched(true);
  };

  const getQuery = !getFunc
    ? undefined
    : useQuery({
        queryKey: [...deps, id],
        queryFn: getFunc,
        onSuccess: (data: T) => {
          updateDtoFromServer(data);
          onGetSuccess?.(data);
        },
        onError: (error: SimpleJsonResponse) => {
          setErrors(extractErrors(error));
          onGetError?.(error);
        },
        enabled: !!id && id !== GUID_EMPTY && id !== "new",
      });

  const setQuery = !setFunc
    ? undefined
    : useMutation(setFunc, {
        onSuccess: (data: T) => {
          updateDtoFromServer(data);
          onSetSuccess?.(data);
          if (autoToaster && translate) {
            toast.success(translate("saved"));
          }
        },
        onError: (error: SimpleJsonResponse) => {
          setErrors(extractErrors(error));
          onSetError?.(error);
        },
      });

  const delQuery = !delFunc
    ? undefined
    : useMutation(delFunc, {
        onSuccess: (data: unknown) => {
          updateDtoFromServer(initialValues);
          onDelSuccess?.(data);
          if (autoToaster && translate) {
            toast.success(translate("deleted"));
          }
        },
        onError: (error: SimpleJsonResponse) => {
          setErrors(extractErrors(error));
          onDelError?.(error);
        },
      });

  const isLoading = getQuery?.isLoading || setQuery?.isLoading || delQuery?.isLoading;
  const error = getQuery?.error || setQuery?.error || delQuery?.error;

  return {
    dto,
    isLoading,
    error,
    touched,
    setDto,
    changeDto,
    getQuery,
    setQuery,
    delQuery,
    errors,
    setErrors,
  };
};
