import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { TGenericQuery } from '../../../types/globals';
import { generateKeyPair } from '../../../utils/card';

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
}: TGetUserCardInfoProps & TGenericQuery) => {
  const { cardAppApiKey } = useCardAppContext();

  return useQuery({
    queryKey: ['getUserCardsInfo', userId, cardId],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');
      if (!cardId) throw new Error('Card ID is missing');

      const { publicKey, privateKey } = generateKeyPair();
      console.log('publicKey', publicKey);

      const response = await axios.get(
        `${API_URL}/banking/${userId}/cards/${cardId}?publicKey=${publicKey}&onlySimpleInfo=false`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const decryptedCvv = privateKey.decrypt(
        response.data.data.cvv,
        'RSAES-PKCS1-V1_5'
      );
      console.log('decryptedCvv', decryptedCvv);
      const decryptedValidPeriod = privateKey.decrypt(
        response.data.data.validPeriod,
        'RSAES-PKCS1-V1_5'
      );

      const userCardInfo: TGetUserCardInfoResponse = {
        ...response.data,
        cvv: decryptedCvv,
        validPeriod: decryptedValidPeriod,
      };
      return userCardInfo;
    },
    enabled: !!enabled,
  });
};
