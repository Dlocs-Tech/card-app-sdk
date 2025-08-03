import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TGenericQuery } from '../../../types/globals';
import type { TTier } from './useGetTiers';

/* Types */
export type TGetTiersByIdProps = {
  tierId: number;
};

export type TGetTiersByIdResponse = {
  success: boolean;
  code: number;
  msg: string;
  data: TTier;
};

/* Hook */
export const useGetTiersById = ({
  tierId,
  onError,
  enabled,
}: TGetTiersByIdProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getTiersById', tierId],
    onError,
    queryFn: async () => {
      if (!tierId) throw new Error('Tier ID is missing');

      const response = await axios.get(`${cardAppApiUrl}/v1/tiers/${tierId}`, {
        headers: { 'x-api-key': cardAppApiKey },
      });

      const tier: TGetTiersByIdResponse = response.data;
      return tier.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
