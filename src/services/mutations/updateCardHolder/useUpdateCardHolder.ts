import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import { API_URL } from '../../../constants';
import type { IGenericMutation } from '../../../types/globals';
import type { ICreateCardHolderProps } from '../createCardHolder';

/* Types */
export type IUpdateCardHolderProps = ICreateCardHolderProps & {
  holderId: number;
};

export type IUpdateCardHolderResponse = {
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
}: IGenericMutation<IUpdateCardHolderResponse>) => {
  const { cardAppApiKey } = useCardAppContext();
  return useMutation<IUpdateCardHolderResponse, Error, IUpdateCardHolderProps>({
    onError,
    onSuccess,
    mutationFn: async ({
      userId,
      holderId,
      ...requestData
    }: IUpdateCardHolderProps) => {
      if (
        !userId ||
        !holderId ||
        Object.values(requestData).some((value) => !value) ||
        !cardAppApiKey
      )
        throw new Error('Card Holder update failed');

      const { data }: { data: IUpdateCardHolderResponse } = await axios.put(
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
