import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TGenericMutation, TQuoteData } from '../../../types/globals';

/* Types */
export type TGenerateCardCreationQuoteResponse = {
  txId: number;
  quotes: TQuoteData[];
};

export type TGenerateCardCreationResponse = {
  code: number;
  msg: string;
  success: boolean;
  data: TGenerateCardCreationQuoteResponse;
};

export type TGenerateCardCreationProps = {
  userId: number;
  quoteParams: {
    holderId: number;
    tierId: number;
  };
};

/* Hook */
export const useGenerateCardCreation = ({
  onError,
  onSuccess,
}: TGenericMutation<TGenerateCardCreationResponse>) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useMutation<
    TGenerateCardCreationResponse,
    Error,
    TGenerateCardCreationProps
  >({
    onError,
    onSuccess,
    mutationFn: async ({ userId, quoteParams }: TGenerateCardCreationProps) => {
      if (!userId || !quoteParams)
        throw new Error('User ID or quote params is missing');

      const { data }: { data: TGenerateCardCreationResponse } =
        await axios.post(
          `${cardAppApiUrl}/v2/cards/${userId}/create`,
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
