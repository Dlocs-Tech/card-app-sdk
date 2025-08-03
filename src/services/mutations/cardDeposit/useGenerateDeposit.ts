import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type {
  TBaseResponse,
  TGenericMutation,
  TQuoteData,
} from '../../../types';

/* Types */
export type TGenerateDepositQuoteResponse = {
  txId: number;
  quotes: TQuoteData[];
};

export type TGenerateDepositResponse = TBaseResponse & {
  data: TGenerateDepositQuoteResponse;
};

/* Props */
export type TGenerateDepositProps = {
  userId: number;
  quoteParams: {
    amount: string;
    holderId: number;
    cardId: number;
  };
};

/* Hook */
export const useGenerateDeposit = ({
  onError,
  onSuccess,
}: TGenericMutation<TGenerateDepositResponse>) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useMutation<TGenerateDepositResponse, Error, TGenerateDepositProps>({
    onError,
    onSuccess,
    mutationFn: async ({ userId, quoteParams }: TGenerateDepositProps) => {
      if (!userId || !quoteParams)
        throw new Error('User ID or quote params is missing');

      const { data }: { data: TGenerateDepositResponse } = await axios.post(
        `${cardAppApiUrl}/v2/deposit/request/${userId}`,
        { quoteParams },
        {
          headers: {
            'x-api-key': cardAppApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return data;
    },
  });
};
