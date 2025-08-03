import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TGenericMutation } from '../../../types/globals';
import type { TCardActionsProps, TCardActionsResponse } from './types';

/* Hook */
export const useUnfreezeCard = ({
  onError,
  onSuccess,
}: TGenericMutation<TCardActionsResponse>) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useMutation<TCardActionsResponse, Error, TCardActionsProps>({
    onError,
    onSuccess,
    mutationFn: async ({ userId, cardId, clientRemark }: TCardActionsProps) => {
      if (!userId || !cardId) throw new Error('User ID or card ID is missing');

      const { data }: { data: TCardActionsResponse } = await axios.post(
        `${cardAppApiUrl}/v1/banking/${userId}/cards/unfreeze/${cardId}`,
        {
          ...(clientRemark && { clientRemark }),
        },
        { headers: { 'x-api-key': cardAppApiKey } }
      );

      return data;
    },
  });
};
