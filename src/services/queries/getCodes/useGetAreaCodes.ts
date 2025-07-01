import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { TGenericQuery } from '../../../types/globals';

/* Types */
export type TAreaCode = {
  code: string;
  name: string;
  areaCode: string;
  language: string;
  enableGlobalTrasnfer: boolean;
};

export type TGetAreaCodesResponse = {
  code: number;
  msg: string;
  success: boolean;
  data: TAreaCode[];
};

/* Hook */
export const useGetAreaCodes = ({
  onError,
  refetchInterval,
}: TGenericQuery) => {
  const { cardAppApiKey } = useCardAppContext();

  return useQuery({
    queryKey: ['getAreaCode'],
    onError,
    refetchInterval,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/banking/mobile`, {
        headers: { 'x-api-key': cardAppApiKey },
      });

      const areaCodes: TGetAreaCodesResponse = response.data;
      return areaCodes.data;
    },
  });
};
