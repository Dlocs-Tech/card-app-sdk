/* Types */
export type IGenericQuery = {
  enabled?: boolean;
  refetchInterval?: number;
  onError?: (error: Error) => void;
};

export type IGenericMutation<T> = {
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
};
