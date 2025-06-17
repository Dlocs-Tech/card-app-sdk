import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { IGenericQuery } from '../../../types/globals';

/* Types */
export type TGetUserProps = {
  email?: string;
  id?: number;
};

export type TCard = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TCardHolders = TCard & {
  cardTypeId: number;
};

export type TCards = TCard & {
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

export type TGetUserResponse = {
  code: number;
  msg: string;
  success: boolean;
  data: TUser;
};

/* Hook */
export const useGetUser = ({
  email,
  id,
  onError,
  enabled,
}: TGetUserProps & IGenericQuery) => {
  const { cardAppApiKey } = useCardAppContext();

  return useQuery({
    queryKey: ['getUser', email, id],
    retry: 1,
    onError,
    queryFn: async () => {
      if (!email && !id) throw new Error('Email and Id are missing');

      const response = await axios.get(`${API_URL}/users`, {
        params: {
          ...(email && { email }),
          ...(id && { id }),
        },
        headers: { 'x-api-key': cardAppApiKey },
      });

      const user: TGetUserResponse = response.data;
      return user;
    },
    enabled: !!enabled,
  });
};
