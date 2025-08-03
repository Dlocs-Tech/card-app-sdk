import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TGenericQuery } from '../../../types/globals';
import type { TTier } from '../getTiers';

/* Types */
export type TBusinessInfo = {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  feeReceiverAddress: string;
  feeCreate: number;
  feeDeposit: number;
  maxCardsPerUser: number;
  tier: TTier;
};

export type TGetCurrentBusinessInfoResponse = {
  success: boolean;
  code: number;
  msg: string;
  data: TBusinessInfo;
};

/* Hook */
export const useGetCurrentBusinessInfo = ({
  onError,
  enabled,
}: TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getCurrentBusinessInfo'],
    onError,
    queryFn: async () => {
      const response = await axios.get(
        `${cardAppApiUrl}/v1/businesses/current`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const businessInfo: TGetCurrentBusinessInfoResponse = response.data;
      return businessInfo.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
