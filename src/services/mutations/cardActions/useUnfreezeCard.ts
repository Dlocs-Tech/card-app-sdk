import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TGenericMutation } from '../../../types';
import type { TCardActionsProps, TCardActionsResponse } from './useFreezeCard';

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
        `${cardAppApiUrl}/v2/cards/${userId}/unfreeze/${cardId}`,
        {
          ...(clientRemark && { clientRemark }),
        },
        { headers: { 'x-api-key': cardAppApiKey } }
      );

      return data;
    },
  });
};
