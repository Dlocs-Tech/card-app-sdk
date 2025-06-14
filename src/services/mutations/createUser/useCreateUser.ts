import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import { API_URL } from '../../../constants';
import type { IGenericMutation } from '../../../types/globals';
import type { TUser } from '../../queries/getUser/useGetUser';

/* Types */
export type ICreateUserProps = {
  email: string;
  role: string;
  address: string;
};

export type ICreateUserResponse = {
  code: number;
  msg: string;
  success: boolean;
  data: TUser;
};

/* Hook */
export const useCreateUser = ({
  onError,
  onSuccess,
}: IGenericMutation<ICreateUserResponse>) => {
  const { cardAppApiKey } = useCardAppContext();
  return useMutation<ICreateUserResponse, Error, ICreateUserProps>({
    onError,
    onSuccess,
    mutationFn: async ({ email, role, address }: ICreateUserProps) => {
      if (!email || !address) throw new Error('Authentication failed');

      const { data }: { data: ICreateUserResponse } = await axios.post(
        `${API_URL}/users`,
        {
          email,
          address,
          role: role ?? 'USER',
        },
        { headers: { 'x-api-key': cardAppApiKey } }
      );

      return data;
    },
  });
};
