import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TBaseResponse, TGenericMutation } from '../../../types';

/* Types */
export type TCardVerification = {
  merchantOrderNo: string;
  orderNo: string;
  title: string;
  target: string;
  content: string;
  tradeType: string;
  tradeStatus: string;
  remark: string;
  createTime: number;
  updateTime: number;
};

/* Response */
export type TVerifyCardResponse = TBaseResponse & {
  data: TCardVerification;
};

/* Props */
export type TVerifyCardProps = {
  userId: number;
  title: string;
  cardNumber: string;
  fileId: string;
  cardId: number;
};

/* Hook */
export const useVerifyCard = ({
  onError,
  onSuccess,
}: TGenericMutation<TVerifyCardResponse>) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useMutation<TVerifyCardResponse, Error, TVerifyCardProps>({
    onError,
    onSuccess,
    mutationFn: async ({
      userId,
      title,
      cardNumber,
      fileId,
      cardId,
    }: TVerifyCardProps) => {
      if (!userId || !title || !cardNumber || !fileId || !cardId)
        throw new Error(
          'User id, title, card number, file id and card id are required'
        );

      const { data }: { data: TVerifyCardResponse } = await axios.post(
        `${cardAppApiUrl}/v1/banking/${userId}/work/submit/${cardId}`,
        {
          title,
          target: cardNumber,
          files: [fileId],
          content: 'Active',
          tradeType: 'CARD_ACTIVE',
        },
        {
          headers: {
            'x-api-key': cardAppApiKey,
          },
        }
      );

      return data;
    },
  });
};
