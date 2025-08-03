import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Response */
export type TAreaCode = {
  code: string;
  name: string;
  areaCode: string;
  language: string;
  enableGlobalTrasnfer: boolean;
};

/* Response */
export type TGetAreaCodesResponse = TBaseResponse & {
  data: TAreaCode[];
};

/* Hook */
export const useGetAreaCodes = ({
  onError,
  refetchInterval,
}: TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getAreaCode'],
    onError,
    refetchInterval,
    queryFn: async () => {
      const response = await axios.get(`${cardAppApiUrl}/v1/banking/mobile`, {
        headers: { 'x-api-key': cardAppApiKey },
      });

      const areaCodes: TGetAreaCodesResponse = response.data;
      return areaCodes.data;
    },
  });
};
