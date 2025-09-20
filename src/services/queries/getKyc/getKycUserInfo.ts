import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Types */
export type TKycUserInfo = {
  createdAt: string;
  updatedAt: string;
  id: number;
  userId: number;
  status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED';
  token: string;
};

/* Response */
export type TGetKycUserInfoResponse = TBaseResponse & {
  data: TKycUserInfo;
};

/* Props */
export type TGetKycUserInfoProps = {
  userId: number;
};

/* Hook */
export const useGetKycUserInfo = ({
  userId,
  onError,
  enabled,
}: TGetKycUserInfoProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getKycUserInfo', userId],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');

      const response = await axios.get(`${cardAppApiUrl}/v3/kyc/${userId}`, {
        headers: { 'x-api-key': cardAppApiKey },
      });

      const kycUserInfo: TGetKycUserInfoResponse = response.data;
      return kycUserInfo.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
