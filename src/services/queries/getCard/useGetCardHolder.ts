import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { IGenericQuery } from '../../../types/globals';

/* Types */
export type TGetCardHolderProps = {
  userId: number;
  holderId: number;
};

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

export type TGetCardHolderResponse = {
  success: boolean;
  code: number;
  msg: string;
  data: TCardHolder;
};

/* Hook */
export const useGetCardHolder = ({
  userId,
  holderId,
  onError,
  enabled,
}: TGetCardHolderProps & IGenericQuery) => {
  const { cardAppApiKey } = useCardAppContext();

  return useQuery({
    queryKey: ['getCardHolder', userId, holderId],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');
      if (!holderId) throw new Error('Holder ID is missing');

      const response = await axios.get(
        `${API_URL}/banking/${userId}/holder/${holderId}`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const cardHolder: TGetCardHolderResponse = response.data;
      return cardHolder;
    },
    enabled: !!enabled,
  });
};
