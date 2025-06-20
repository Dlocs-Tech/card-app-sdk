import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import { API_URL } from '../../../constants';
import type { TGenericMutation } from '../../../types/globals';

/* Types */
export type TValidateDepositProps = {
  transactionId: string;
  txHash: string;
};

export type TValidateDepositResponse = {
  success: boolean;
  code: number;
  msg: string;
  data: {
    txId: number;
  };
};

/* Hook */
export const useValidateDeposit = ({
  onError,
  onSuccess,
}: TGenericMutation<TValidateDepositResponse>) => {
  const { cardAppApiKey } = useCardAppContext();
  return useMutation<TValidateDepositResponse, Error, TValidateDepositProps>({
    onError,
    onSuccess,
    mutationFn: async ({ transactionId, txHash }: TValidateDepositProps) => {
      if (!transactionId || !txHash)
        throw new Error('Transaction ID or TX hash is missing');

      const { data }: { data: TValidateDepositResponse } = await axios.post(
        `${API_URL}/bridge/validate-deposit/${transactionId}`,
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
