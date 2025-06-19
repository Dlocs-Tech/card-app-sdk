import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { TGenericQuery } from '../../../types/globals';
import type { TGetUserProps, TGetUserResponse } from './types';

/* Hook */
export const useGetUser = ({
  email,
  onError,
  enabled,
}: TGetUserProps & TGenericQuery) => {
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
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
