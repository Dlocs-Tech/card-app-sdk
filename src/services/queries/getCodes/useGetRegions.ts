import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Types */
export type TRegion = {
  code: string;
  name: string;
  standardCode: string;
};

/* Response */
export type TGetRegionsResponse = TBaseResponse & {
  data: TRegion[];
};

/* Hook */
export const useGetRegions = ({ onError, refetchInterval }: TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getRegions'],
    onError,
    refetchInterval,
    queryFn: async () => {
      const response = await axios.get(`${cardAppApiUrl}/v1/banking/region`, {
        headers: { 'x-api-key': cardAppApiKey },
      });

      const regions: TGetRegionsResponse = response.data;
      return regions.data;
    },
  });
};
