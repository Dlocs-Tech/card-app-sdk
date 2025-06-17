import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import { API_URL } from '../../../constants';
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
  const { cardAppApiKey } = useCardAppContext();
  return useMutation<TUpdateCardHolderResponse, Error, TUpdateCardHolderProps>({
    onError,
    onSuccess,
    mutationFn: async ({
      userId,
      holderId,
      ...requestData
    }: TUpdateCardHolderProps) => {
      if (
        !userId ||
        !holderId ||
        Object.values(requestData).some((value) => !value) ||
        !cardAppApiKey
      )
        throw new Error('Card Holder update failed');

      const { data }: { data: TUpdateCardHolderResponse } = await axios.put(
        `${API_URL}/banking/${userId}/holder/${holderId}`,
        requestData,
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
