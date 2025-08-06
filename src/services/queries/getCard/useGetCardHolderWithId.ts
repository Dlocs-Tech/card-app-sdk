import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Types */
export type TCardHolder = {
  holderId: number;
  cardTypeId: number;
  status: string;
  statusStr: string;
  respMsg: string;
  areaCode: string;
  mobile: string;
  email: string;
  firstName: string;
  lastName: string;
  birthday: string;
  country: string;
  town: string;
  address: string;
  postCode: string;
};

/* Response */
export type TGetCardHolderResponse = TBaseResponse & {
  data: TCardHolder;
};

/* Props */
export type TGetCardHolderWithIdProps = {
  userId: number;
  holderId: number;
};

/* Hook */
export const useGetCardHolderWithId = ({
  userId,
  holderId,
  onError,
  enabled,
}: TGetCardHolderWithIdProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getCardHolderWithId', userId, holderId],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');
      if (!holderId) throw new Error('Holder ID is missing');

      const response = await axios.get(
        `${cardAppApiUrl}/v1/banking/${userId}/holder/${holderId}`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const cardHolder: TGetCardHolderResponse = response.data;
      return cardHolder.data;
    },
    enabled: !!enabled,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });
};
