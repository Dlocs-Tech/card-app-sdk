import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Types */
export type TCity = {
  code: string;
  name: string;
  country: string;
  parentCode: string;
};

/* Response */
export type TGetCitiesResponse = TBaseResponse & {
  data: TCity[];
};

/* Props */
export type TGetCitiesProps = TGenericQuery & {
  regionCode: string;
};

/* Hook */
export const useGetCities = ({
  onError,
  refetchInterval,
  regionCode,
}: TGetCitiesProps) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getCities', regionCode],
    onError,
    refetchInterval,
    queryFn: async () => {
      const response = await axios.get(
        `${cardAppApiUrl}/v1/banking/city?regionCode=${regionCode}`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const cities: TGetCitiesResponse = response.data;
      return cities.data;
    },
  });
};
