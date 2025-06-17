import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { TGenericQuery } from '../../../types/globals';
import type { TGetUserByIdProps, TGetUserResponse } from './types';

/* Hook */
export const useGetUserById = ({
  id,
  onError,
  enabled,
}: TGetUserByIdProps & TGenericQuery) => {
  const { cardAppApiKey } = useCardAppContext();

  return useQuery({
    queryKey: ['getUserById', id],
    retry: 1,
    onError,
    queryFn: async () => {
      if (!id) throw new Error('Id is missing');

      const response = await axios.get(`${API_URL}/users`, {
        params: { id },
        headers: { 'x-api-key': cardAppApiKey },
      });

      const user: TGetUserResponse = response.data;
      return user;
    },
    enabled: !!enabled,
  });
};
