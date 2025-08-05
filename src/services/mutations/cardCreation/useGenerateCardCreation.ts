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
  holderId: number;
  tierId: number;
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
      if (!userId || !holderId || !tierId)
        throw new Error('User ID, holder ID, or tier ID is missing');

      const { data }: { data: TGenerateCardCreationResponse } =
        await axios.post(
          `${cardAppApiUrl}/v2/cards/${userId}/create`,
          { holderId, tierId },
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
