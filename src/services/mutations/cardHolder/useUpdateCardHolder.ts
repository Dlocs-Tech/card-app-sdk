import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TBaseResponse, TGenericMutation } from '../../../types';
import type { TCreateCardHolderProps } from './useCreateCardHolder';

/* Response */
export type TUpdateCardHolderResponse = TBaseResponse & {
  data: {
    holderId: number;
    cardTypeId: number;
    status: string;
    statusStr: string;
    respMsg: string;
  };
};

/* Props */
export type TUpdateCardHolderProps = TCreateCardHolderProps & {
  holderId: number;
};

/* Hook */
export const useUpdateCardHolder = ({
  onError,
  onSuccess,
}: TGenericMutation<TUpdateCardHolderResponse>) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useMutation<TUpdateCardHolderResponse, Error, TUpdateCardHolderProps>({
    onError,
    onSuccess,
    mutationFn: async ({
      userId,
      holderId,
      ...requestData
    }: TUpdateCardHolderProps) => {
      if (!userId || !holderId)
        throw new Error('User ID or holder ID is missing');

      const filteredRequestData = Object.fromEntries(
        Object.entries(requestData).filter(([, value]) => value !== undefined)
      );

      const { data }: { data: TUpdateCardHolderResponse } = await axios.put(
        `${cardAppApiUrl}/v1/banking/${userId}/holder/${holderId}`,
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
