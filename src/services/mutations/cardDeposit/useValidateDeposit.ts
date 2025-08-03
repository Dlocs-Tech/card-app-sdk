import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TBaseResponse, TGenericMutation } from '../../../types/globals';

/* Response */
export type TValidateDepositResponse = TBaseResponse & {
  data: {
    txId: number;
  };
};

/* Props */
export type TValidateDepositProps = {
  transactionId: string;
  txHash: string;
};

/* Hook */
export const useValidateDeposit = ({
  onError,
  onSuccess,
}: TGenericMutation<TValidateDepositResponse>) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useMutation<TValidateDepositResponse, Error, TValidateDepositProps>({
    onError,
    onSuccess,
    mutationFn: async ({ transactionId, txHash }: TValidateDepositProps) => {
      if (!transactionId || !txHash)
        throw new Error('Transaction ID or TX hash is missing');

      const { data }: { data: TValidateDepositResponse } = await axios.post(
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
