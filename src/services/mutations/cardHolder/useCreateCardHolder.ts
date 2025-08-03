import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TBaseResponse, TGenericMutation } from '../../../types';

/* Response */
export type TCreateCardHolderResponse = TBaseResponse & {
  data: {
    holderId: number;
    cardTypeId: number;
    status: string;
    statusStr: string;
    respMsg: string;
  };
};

/* Props */
export type TCreateCardHolderProps = {
  userId: number;
  cardTypeId: number;
  areaCode: string;
  mobile: string;
  firstName: string;
  lastName: string;
  birthday?: string;
  country?: string;
  town?: string;
  address?: string;
  postCode?: string;
};

/* Hook */
export const useCreateCardHolder = ({
  onError,
  onSuccess,
}: TGenericMutation<TCreateCardHolderResponse>) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useMutation<TCreateCardHolderResponse, Error, TCreateCardHolderProps>({
    onError,
    onSuccess,
    mutationFn: async ({ userId, ...requestData }: TCreateCardHolderProps) => {
      if (!userId) throw new Error('User ID is missing');

      const filteredRequestData = Object.fromEntries(
        Object.entries(requestData).filter(([, value]) => value !== undefined)
      );

      const { data }: { data: TCreateCardHolderResponse } = await axios.post(
        `${cardAppApiUrl}/v1/banking/${userId}/holder`,
        filteredRequestData,
        {
          headers: {
            'x-api-key': cardAppApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return data;
    },
  });
};
