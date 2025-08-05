import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type {
  TBaseResponse,
  TGenericMutation,
  TQuoteData,
} from '../../../types';

/* Response */
export type TGenerateCardCreationQuoteResponse = {
  txId: number;
  quotes: TQuoteData[];
};

export type TGenerateCardCreationResponse = TBaseResponse & {
  data: TGenerateCardCreationQuoteResponse;
};

/* Props */
export type TGenerateCardCreationProps = {
  userId: number;
  holderId?: number;
  tierId?: number;
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
    mutationFn: async ({
      userId,
      holderId,
      tierId,
    }: TGenerateCardCreationProps) => {
      const body: Record<string, number> = {};

      if (!userId) throw new Error('User ID is missing');

      if (!holderId && !tierId)
        throw new Error('Holder ID or tier ID is missing');

      if (holderId && tierId)
        throw new Error('Holder ID and tier ID cannot be provided together');

      if (holderId) {
        body.holderId = holderId;
      }

      if (tierId) {
        body.tierId = tierId;
      }

      const { data }: { data: TGenerateCardCreationResponse } =
        await axios.post(`${cardAppApiUrl}/v2/cards/${userId}/create`, body, {
          headers: {
            'x-api-key': cardAppApiKey,
            'Content-Type': 'application/json',
          },
        });

      return data;
    },
  });
};
