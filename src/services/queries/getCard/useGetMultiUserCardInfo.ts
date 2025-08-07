import axios from 'axios';
import { useCardAppContext } from '../../../providers';
import { useQuery } from '@tanstack/react-query';
import { STALE_TIME } from '../../../constants';
import { exportPublicKey, generateKeyPair } from '../../../utils';
import type { TGenericQuery } from '../../../types';
import type {
  TGetUserCardInfoResponse,
  TUserCardInfo,
} from './useGetUserCardInfo';

/* Props */
export type TGetMultiUserCardInfoProps = {
  userId: number;
  cardIds: number[];
};

/* Hook */
export const useGetMultiUserCardInfo = ({
  userId,
  cardIds,
  onError,
  enabled,
}: TGetMultiUserCardInfoProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getMultiUserCardInfo', userId, cardIds],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');
      if (!cardIds) throw new Error('Card IDs are missing');

      const { publicKey: publicKeyPem } = generateKeyPair();
      const publicKey = exportPublicKey(publicKeyPem);

      const cardsInfos = await Promise.all(
        cardIds.map((cardId) =>
          fetchCardInfo(cardAppApiUrl, cardAppApiKey, publicKey, userId, cardId)
        )
      );

      return cardsInfos.filter((result) => result !== null);
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};

/* Utils */
const fetchCardInfo = async (
  cardAppApiUrl: string,
  cardAppApiKey: string,
  publicKey: string,
  userId: number,
  cardId: number
) => {
  try {
    const response = await axios.get(
      `${cardAppApiUrl}/v2/cards/${userId}/${cardId}?publicKey=${encodeURIComponent(publicKey)}&onlySimpleInfo=false`,
      {
        headers: { 'x-api-key': cardAppApiKey },
      }
    );

    const userCardInfo: TGetUserCardInfoResponse = response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cvv, validPeriod, ...cardInfo } = userCardInfo.data;

    return cardInfo as Omit<TUserCardInfo, 'cvv' | 'validPeriod'>;
  } catch (error) {
    console.error(`Error fetching card info: ${error}`);
    return null;
  }
};
