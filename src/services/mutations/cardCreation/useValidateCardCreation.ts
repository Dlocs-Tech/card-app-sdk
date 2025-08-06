import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TBaseResponse, TGenericMutation } from '../../../types';

/* Response */
export type TValidateCardCreationResponse = TBaseResponse & {
  data: {
    txId: number;
  };
};

/* Props */
export type TValidateCardCreationProps = {
  transactionId: string;
  txHash: string;
};

/* Hook */
export const useValidateCardCreation = ({
  onError,
  onSuccess,
}: TGenericMutation<TValidateCardCreationResponse>) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useMutation<
    TValidateCardCreationResponse,
    Error,
    TValidateCardCreationProps
  >({
    onError,
    onSuccess,
    mutationFn: async ({
      transactionId,
      txHash,
    }: TValidateCardCreationProps) => {
      if (!transactionId || !txHash)
        throw new Error('Transaction ID or TX hash is missing');

      const { data }: { data: TValidateCardCreationResponse } =
        await axios.post(
          `${cardAppApiUrl}/v1/deposit/validate-deposit/${transactionId}`,
          { txHash },
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
