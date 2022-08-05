import { DependencyList, useEffect, useState } from "react";

export function useFetch<T>(func: () => Promise<T>, deps: DependencyList = []) {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      setIsLoading(true);
      try {
        const json = await func();
        setIsLoading(false);
        if (!ignore) {
          setData(json);
        }
      } catch (e) {
        debugger;
        setIsLoading(false);
        setError(e);
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, deps);
  return { isLoading, data, error };
}
