// queryFn.ts
import {
  type QueryFunction,
  useQuery,
  useMutation,
} from "@tanstack/react-query";

const createFetcher = (baseUrl: string) => {
  return async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      ...options,
    });

    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status}`);
    }

    return res.json() as Promise<T>;
  };
};

const fetcher = createFetcher("http://localhost:3002" as string);

const makeQueryFn =
  <T>(): QueryFunction<T, readonly unknown[]> =>
  async ({ queryKey }) => {
    const [endpoint] = queryKey;
    if (typeof endpoint !== "string") {
      throw new Error("Endpoint must be a string");
    }
    return fetcher<T>(endpoint);
  };

const makeMutationFn =
  <T, V>(
    endpoint: string,
    method: "POST" | "PUT" | "DELETE",
  ): ((variables: V) => Promise<T>) =>
  async (variables: V) => {
    const res = await fetcher<T>(endpoint, {
      method,
      body: JSON.stringify(variables),
    });
    return res;
  };

export const useAPIQuery = <T>(key: string) => {
  return useQuery<T>({
    queryKey: [key],
    queryFn: makeQueryFn<T>(),
  });
};

export const useAPIMutation = <T, V>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE",
  onError?: (error: Error) => void,
  onSuccess?: (data: T) => void,
) => {
  return useMutation<T, Error, V>({
    mutationFn: makeMutationFn<T, V>(endpoint, method),
    onError,
    onSuccess,
  });
};
