import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { IGenericQuery } from '../../../types/globals';

export type TRegionResponse = {
  code: string;
  name: string;
  standardCode: string;
};
export type TGetRegionsResponse = {
  code: number;
  msg: string;
  success: boolean;
  data: TRegionResponse[];
};

/* Hook */
export const useGetRegions = ({ onError, refetchInterval }: IGenericQuery) => {
  const { cardAppApiKey } = useCardAppContext();

  return useQuery({
    queryKey: ['getRegions'],
    onError,
    refetchInterval,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/banking/region`, {
        headers: { 'x-api-key': cardAppApiKey },
      });

      const regions: TGetRegionsResponse = response.data;
      return regions;
    },
  });
};
