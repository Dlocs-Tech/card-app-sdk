import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { IGenericQuery } from '../../../types/globals';

/* Types */
export type TGetUserProps = {
  email: string;
};

export type TUser = {
  email: string;
  id: number;
  businessId: number;
  holderId: number;
  role: string;
  isVerified: true;
  address: string;
  card: string[];
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
  onError,
  enabled,
}: TGetUserProps & IGenericQuery) => {
  const { cardAppApiKey } = useCardAppContext();

  return useQuery({
    queryKey: ['getUser', email],
    retry: 1,
    onError,
    queryFn: async () => {
      if (!email) throw new Error('Email is missing');

      const response = await axios.get(`${API_URL}/users`, {
        params: { email },
        headers: { 'x-api-key': cardAppApiKey },
      });

      const user: TGetUserResponse = response.data;
      return user;
    },
    enabled: !!enabled,
  });
};
