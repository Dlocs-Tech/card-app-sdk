import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TGenericMutation } from '../../../types/globals';
import type { TCreateCardHolderProps } from './useCreateCardHolder';

/* Types */
export type TUpdateCardHolderProps = TCreateCardHolderProps & {
  holderId: number;
};

export type TUpdateCardHolderResponse = {
  success: boolean;
  code: number;
  msg: string;
  data: {
    holderId: number;
    cardTypeId: number;
    status: string;
    statusStr: string;
    respMsg: string;
  };
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
        `${cardAppApiUrl}/banking/${userId}/holder/${holderId}`,
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
