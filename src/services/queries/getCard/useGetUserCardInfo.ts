import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { IGenericQuery } from '../../../types/globals';

/* Types */
export type TGetUserCardInfoProps = {
  userId: number;
  cardId: number;
};

export type TBalanceInfo = {
  cardNo: string;
  amount: string;
  usedAmount: string;
  currency: string;
};

export type TUserCardInfo = {
  id: number;
  cardNo: string;
  holderId: number;
  cardNumber: string;
  cvv: string;
  validPeriod: string;
  status: string;
  statusStr: string;
  bindTime: number;
  remark: string | null;
  balanceInfo: TBalanceInfo;
};

export type TGetUserCardInfoResponse = {
  success: boolean;
  code: number;
  msg: string;
  data: TUserCardInfo;
};

/* Hook */
export const useGetUserCardInfo = ({
  userId,
  cardId,
  onError,
  enabled,
}: TGetUserCardInfoProps & IGenericQuery) => {
  const { cardAppApiKey } = useCardAppContext();

  return useQuery({
    queryKey: ['getUserCardsInfo', userId, cardId],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');
      if (!cardId) throw new Error('Card ID is missing');

      const response = await axios.get(
        `${API_URL}/banking/${userId}/cards/${cardId}`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const userCardInfo: TGetUserCardInfoResponse = response.data;
      return userCardInfo;
    },
    enabled: !!enabled,
  });
};
