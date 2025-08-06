import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TBaseResponse, TGenericQuery } from '../../../types';
import type { TTransaction } from './useGetUserTransactions';

/* Response */
export type TGetUserTransactionsByIdResponse = TBaseResponse & {
  data: TTransaction;
};

/* Props */
export type TGetUserTransactionsByIdProps = {
  id: number;
  userId: number;
};

/* Hook */
export const useGetUserTransactionsById = ({
  id,
  userId,
  onError,
  enabled,
}: TGetUserTransactionsByIdProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getUserTransactionsById', userId, id],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');
      if (!id) throw new Error('Transaction ID is missing');

      const response = await axios.get(
        `${cardAppApiUrl}/v1/transactions/${userId}/${id}`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const transactionsById: TGetUserTransactionsByIdResponse = response.data;
      return transactionsById.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
