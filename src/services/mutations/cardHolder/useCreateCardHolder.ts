import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import { API_URL } from '../../../constants';
import type { TGenericMutation } from '../../../types/globals';

/* Types */
export type TCreateCardHolderProps = {
  address: string;
  userId?: number;
  cardTypeId: number;
  areaCode: string;
  mobile: string;
  firstName: string;
  lastName: string;
  birthday: string;
  country: string;
  town: string;
  postCode: string;
};

export type TCreateCardHolderResponse = {
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
export const useCreateCardHolder = ({
  onError,
  onSuccess,
}: TGenericMutation<TCreateCardHolderResponse>) => {
  const { cardAppApiKey } = useCardAppContext();
  return useMutation<TCreateCardHolderResponse, Error, TCreateCardHolderProps>({
    onError,
    onSuccess,
    mutationFn: async ({ userId, ...requestData }: TCreateCardHolderProps) => {
      if (
        !userId ||
        Object.values(requestData).some((value) => !value) ||
        !cardAppApiKey
      )
        throw new Error('Authentication failed');

      const { data }: { data: TCreateCardHolderResponse } = await axios.post(
        `${API_URL}/banking/${userId}/holder`,
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
