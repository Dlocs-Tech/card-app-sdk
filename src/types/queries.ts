export type TGenericQuery = {
  enabled?: boolean;
  refetchInterval?: number;
  onError?: (error: Error) => void;
};
