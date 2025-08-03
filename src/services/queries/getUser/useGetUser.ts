import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Types */
export type TCardHolders = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  cardTypeId: number;
};

export type TCards = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  cardNo: string;
  userId: number;
};

export type TUser = {
  email: string;
  id: number;
  businessId: number;
  role: string;
  isVerified: true;
  address: string;
  card: TCards[];
  cardHolder: TCardHolders[];
  createdAt: Date;
  updatedAt: Date;
};

/* Response */
export type TGetUserResponse = TBaseResponse & {
  data: TUser;
};

/* Props */
export type TGetUserProps = {
  email: string;
};

/* Hook */
export const useGetUser = ({
  email,
  onError,
  enabled,
}: TGetUserProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getUser', email],
    retry: 1,
    onError,
    queryFn: async () => {
      if (!email) throw new Error('Email is missing');

      const response = await axios.get(`${cardAppApiUrl}/v1/users`, {
        params: { email },
        headers: { 'x-api-key': cardAppApiKey },
      });

      const user: TGetUserResponse = response.data;
      return user.data;
    },
    enabled: !!enabled,
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
