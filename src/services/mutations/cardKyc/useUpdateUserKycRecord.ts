import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TBaseResponse, TGenericMutation } from '../../../types';
import type { TUserKycRecord, TKycStatus } from './useCreateUserKycRecord';

/* Response */
export type TUpdateUserKycRecordResponse = TBaseResponse & {
  data: TUserKycRecord;
};

/* Props */
export type TUpdateUserKycRecordProps = {
  userId: number;
  token: string;
  status: TKycStatus;
};

/* Hook */
export const useUpdateUserKycRecord = ({
  onError,
  onSuccess,
}: TGenericMutation<TUpdateUserKycRecordResponse>) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useMutation<
    TUpdateUserKycRecordResponse,
    Error,
    TUpdateUserKycRecordProps
  >({
    onError,
    onSuccess,
    mutationFn: async ({
      userId,
      token,
      status,
    }: TUpdateUserKycRecordProps) => {
      if (!userId || !token || !status)
        throw new Error('userId, token and status are required');

      const { data }: { data: TUpdateUserKycRecordResponse } =
        await axios.patch(
          `${cardAppApiUrl}/v3/kyc/${userId}`,
          {
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
