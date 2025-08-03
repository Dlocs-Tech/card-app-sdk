import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TGenericQuery } from '../../../types/globals';

/* Types */
export type TGetTiersProps = {
  businessId: number;
};

export type TTierRule = {
  createdAt: string;
  updatedAt: string;
  id: number;
  value: string;
  description: string;
  type:
    | 'MAX_CARDS_PER_USER'
    | 'CARD_TYPE'
    | 'DURATION_DAYS'
    | 'EXTRA_FEE_DEPOSIT'
    | 'EXTRA_FEE_SUBSCRIPTION'
    | 'EXTRA_FEE_CREATE';
};

export type TTier = {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  disabled: boolean;
  businessId: number;
  rules: TTierRule[];
};

export type TGetTiersResponse = {
  success: boolean;
  code: number;
  msg: string;
  data: TTier[];
};

/* Hook */
export const useGetTiers = ({
  businessId,
  onError,
  enabled,
}: TGetTiersProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getTiers', businessId],
    onError,
    queryFn: async () => {
      if (!businessId) throw new Error('Business ID is missing');

      const queryUrl = new URL(`${cardAppApiUrl}/v1/tiers`);
      queryUrl.searchParams.set('businessId', businessId.toString());

      const response = await axios.get(queryUrl.toString(), {
        headers: { 'x-api-key': cardAppApiKey },
      });

      const tiers: TGetTiersResponse = response.data;
      return tiers.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
