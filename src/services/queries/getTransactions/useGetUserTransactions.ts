import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL, STALE_TIME } from '../../../constants';
import type { TGenericQuery } from '../../../types/globals';

/* Types */
export type TGetUserTransactionsProps = {
  userId: number;
};

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
  createdAt: string;
  updatedAt: string;
};

export type TGetUserTransactionsResponse = {
  success: boolean;
  code: number;
  msg: string;
  data: TTransaction[];
};

/* Hook */
export const useGetUserTransactions = ({
  userId,
  onError,
  enabled,
}: TGetUserTransactionsProps & TGenericQuery) => {
  const { cardAppApiKey } = useCardAppContext();

  return useQuery({
    queryKey: ['getUserTransactions', userId],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');

      const response = await axios.get(`${API_URL}/transactions/${userId}`, {
        headers: { 'x-api-key': cardAppApiKey },
      });

      const transactions: TGetUserTransactionsResponse = response.data;
      return transactions;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
