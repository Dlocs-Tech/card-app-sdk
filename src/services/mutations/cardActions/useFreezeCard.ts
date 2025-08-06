import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TBaseResponse, TGenericMutation } from '../../../types';

/* Types */
export type TCard = {
  orderNo: string;
  merchantOrderNo: string;
  cardNo: string;
  currency: string;
  amount: string;
  fee: string;
  receivedAmount: string;
  receivedCurrency: string;
  type: string;
  status: string;
  remark: string;
  transactionTime: number;
};

/* Response */
export type TCardActionsResponse = TBaseResponse & {
  data: TCard;
};

/* Props */
export type TCardActionsProps = {
  userId: number;
  cardId: number;
  clientRemark?: string;
};

/* Hook */
export const useFreezeCard = ({
  onError,
  onSuccess,
}: TGenericMutation<TCardActionsResponse>) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useMutation<TCardActionsResponse, Error, TCardActionsProps>({
    onError,
    onSuccess,
    mutationFn: async ({ userId, cardId, clientRemark }: TCardActionsProps) => {
      if (!userId || !cardId) throw new Error('User ID or card ID is missing');

      const { data }: { data: TCardActionsResponse } = await axios.post(
        `${cardAppApiUrl}/v2/cards/${userId}/freeze/${cardId}`,
        {
          ...(clientRemark && { clientRemark }),
        },
        { headers: { 'x-api-key': cardAppApiKey } }
      );

      return data;
    },
  });
};
