import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TBaseResponse, TGenericMutation } from '../../../types';
import type { TUser } from '../../queries/getUser';

/* Response */
export type TCreateUserResponse = TBaseResponse & {
  data: TUser;
};

/* Props */
export type TCreateUserProps = {
  email: string;
  role: string;
  address: string;
};

/* Hook */
export const useCreateUser = ({
  onError,
  onSuccess,
}: TGenericMutation<TCreateUserResponse>) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useMutation<TCreateUserResponse, Error, TCreateUserProps>({
    onError,
    onSuccess,
    mutationFn: async ({ email, role, address }: TCreateUserProps) => {
      if (!email || !address) throw new Error('Authentication failed');

      const { data }: { data: TCreateUserResponse } = await axios.post(
        `${cardAppApiUrl}/v1/users`,
        {
          email,
          address,
          role: role ?? 'USER',
        },
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
