export interface IGenericQuery {
  enabled?: boolean;
  refetchInterval?: number;
  onError?: (error: Error) => void;
}

export interface IGenericMutation<T> {
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
}
