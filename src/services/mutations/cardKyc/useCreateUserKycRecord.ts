import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TBaseResponse, TGenericMutation } from '../../../types';

/* Response */
export type TKycStatus = 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED';

export type TUserKycRecord = {
  createdAt: string;
  updatedAt: string;
  id: number;
  userId: number;
  status: TKycStatus;
  token: string;
};

export type TCreateUserKycRecordResponse = TBaseResponse & {
  data: TUserKycRecord;
};

/* Props */
export type TCreateUserKycRecordProps = {
  userId: number;
  token: string;
  status: TKycStatus;
};

/* Hook */
export const useCreateUserKycRecord = ({
  onError,
  onSuccess,
}: TGenericMutation<TCreateUserKycRecordResponse>) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useMutation<
    TCreateUserKycRecordResponse,
    Error,
    TCreateUserKycRecordProps
  >({
    onError,
    onSuccess,
    mutationFn: async ({
      userId,
      token,
      status,
    }: TCreateUserKycRecordProps) => {
      if (!userId || !token || !status)
        throw new Error('userId, token and status are required');

      const { data }: { data: TCreateUserKycRecordResponse } = await axios.post(
        `${cardAppApiUrl}/v3/kyc`,
        {
          userId,
          token,
          status,
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
