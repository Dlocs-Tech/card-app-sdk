import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Types */
export type TTransaction = {
  id: number;
  orderNo: string;
  status: string;
  type: string;
  transactionTime: string;
  userId: number;
  depositAddress: string;
  amount: string;
  blockTimestamp: number;
  description: string;
  createdAt: string;
  updatedAt: string;
};

/* Response */
export type TGetUserTransactionsResponse = TBaseResponse & {
  data: TTransaction[];
};

/* Props */
export type TGetUserTransactionsProps = {
  userId: number;
};

/* Hook */
export const useGetUserTransactions = ({
  userId,
  onError,
  enabled,
}: TGetUserTransactionsProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getUserTransactions', userId],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');

      const response = await axios.get(
        `${cardAppApiUrl}/v1/transactions/${userId}`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const transactions: TGetUserTransactionsResponse = response.data;
      return transactions.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
