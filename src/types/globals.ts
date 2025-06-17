/* Types */
export type TGenericQuery = {
  enabled?: boolean;
  refetchInterval?: number;
  onError?: (error: Error) => void;
};

export type TGenericMutation<T> = {
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
};
