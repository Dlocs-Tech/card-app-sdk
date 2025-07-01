import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { TGenericQuery } from '../../../types/globals';

/* Types */
export type TCity = {
  code: string;
  name: string;
  country: string;
  parentCode: string;
};

export type TGetCitiesResponse = {
  code: number;
  msg: string;
  success: boolean;
  data: TCity[];
};

/* Hook */
export const useGetCities = ({ onError, refetchInterval }: TGenericQuery) => {
  const { cardAppApiKey } = useCardAppContext();

  return useQuery({
    queryKey: ['getCities'],
    onError,
    refetchInterval,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/banking/city`, {
        headers: { 'x-api-key': cardAppApiKey },
      });

      const cities: TGetCitiesResponse = response.data;
      return cities.data;
    },
  });
};
