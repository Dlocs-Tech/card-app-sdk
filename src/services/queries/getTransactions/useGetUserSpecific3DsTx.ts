import axios from 'axios';
import forge from 'node-forge';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TBaseResponse, TGenericQuery } from '../../../types';
import type { TUser3DsTx } from './useGetUser3DsTxs';
import { exportPublicKey, generateKeyPair } from '../../../utils';

/* Response */
export type TGetUserSpecific3DsTxResponse = TBaseResponse & {
  data: TUser3DsTx;
};

/* Props */
export type TGetUserSpecific3DsTxProps = {
  userId: number;
  cardId: number;
  tradeNo: string;
};

/* Hook */
export const useGetUserSpecific3DsTx = ({
  userId,
  cardId,
  tradeNo,
  onError,
  enabled,
}: TGetUserSpecific3DsTxProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getUserSpecific3DsTx', userId, cardId, tradeNo],
    onError,
    queryFn: async () => {
      if (!userId || !cardId || !tradeNo)
        throw new Error('User ID, cardId, tradeNo are required');

      const { publicKey: publicKeyPem, privateKey } = generateKeyPair();
      const publicKey = exportPublicKey(publicKeyPem);

      const response = await axios.get(
        `${cardAppApiUrl}/v2/transactions/${userId}/3ds/${cardId}/${tradeNo}?publicKey=${encodeURIComponent(publicKey)}`,
        {
          headers: {
            'x-api-key': cardAppApiKey,
          },
        }
      );

      const userSpecific3DsTx: TGetUserSpecific3DsTxResponse = response.data;
      const userSpecific3DsTxData = userSpecific3DsTx.data;

      if (!userSpecific3DsTxData)
        throw new Error('User specific 3DS tx is missing');

      const encryptedValues = forge.util.decode64(userSpecific3DsTxData.values);
      const decryptedValues = privateKey.decrypt(encryptedValues, 'RSA-OAEP');

      return {
        ...userSpecific3DsTxData,
        values: decryptedValues,
      };
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
