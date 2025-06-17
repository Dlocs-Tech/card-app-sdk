import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { TGenericQuery } from '../../../types/globals';
import type { TTransaction } from './useGetUserTransactions';

/* Types */
export type TGetUserTransactionsByIdProps = {
  id: number;
  userId: number;
};

export type TGetUserTransactionsByIdResponse = {
  success: boolean;
  code: number;
  msg: string;
  data: TTransaction;
};

/* Hook */
export const useGetUserTransactionsById = ({
  id,
  userId,
  onError,
  enabled,
}: TGetUserTransactionsByIdProps & TGenericQuery) => {
  const { cardAppApiKey } = useCardAppContext();

  return useQuery({
    queryKey: ['getUserTransactionsById', userId, id],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');
      if (!id) throw new Error('Transaction ID is missing');

      const response = await axios.get(
        `${API_URL}/transactions/${userId}/${id}`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const transactionsById: TGetUserTransactionsByIdResponse = response.data;
      return transactionsById;
    },
    enabled: !!enabled,
  });
};
