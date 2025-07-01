import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { TGenericQuery } from '../../../types/globals';
import { exportPublicKey, generateKeyPair } from '../../../utils/card';
import forge from 'node-forge';

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

      const { publicKey: publicKeyPem, privateKey } = generateKeyPair();
      const publicKey = exportPublicKey(publicKeyPem);

      const response = await axios.get(
        `${API_URL}/banking/${userId}/cards/${cardId}?publicKey=${encodeURIComponent(publicKey)}&onlySimpleInfo=false`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const encryptedCvv = forge.util.decode64(response.data.data.cvv);
      const decryptedCvv = privateKey.decrypt(encryptedCvv, 'RSA-OAEP');

      const encryptedValidPeriod = forge.util.decode64(
        response.data.data.validPeriod
      );
      const decryptedValidPeriod = privateKey.decrypt(
        encryptedValidPeriod,
        'RSA-OAEP'
      );

      const cardInfoResponse: TGetUserCardInfoResponse = response.data;

      const userCardInfo = {
        ...cardInfoResponse.data,
        cvv: decryptedCvv,
        validPeriod: decryptedValidPeriod,
      };

      return userCardInfo;
    },
    enabled: !!enabled,
  });
};
