export type TGenericMutation<T> = {
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
};
