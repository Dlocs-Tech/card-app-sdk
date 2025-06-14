import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import { API_URL } from '../../../constants';
import type { IGenericMutation } from '../../../types/globals';

/* Types */
export type ICreateCardHolderProps = {
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

export type ICreateCardHolderResponse = {
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
}: IGenericMutation<ICreateCardHolderResponse>) => {
  const { cardAppApiKey } = useCardAppContext();
  return useMutation<ICreateCardHolderResponse, Error, ICreateCardHolderProps>({
    onError,
    onSuccess,
    mutationFn: async ({ userId, ...requestData }: ICreateCardHolderProps) => {
      if (
        !userId ||
        Object.values(requestData).some((value) => !value) ||
        !cardAppApiKey
      )
        throw new Error('Authentication failed');

      const { data }: { data: ICreateCardHolderResponse } = await axios.post(
        `${API_URL}/banking/holder/${userId}`,
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
