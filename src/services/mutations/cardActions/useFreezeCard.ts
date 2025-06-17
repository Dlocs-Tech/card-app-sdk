import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import { API_URL } from '../../../constants';
import type { IGenericMutation } from '../../../types/globals';
import type { ICardActionsProps, ICardActionsResponse } from './types';

/* Hook */
export const useFreezeCard = ({
  onError,
  onSuccess,
}: IGenericMutation<ICardActionsResponse>) => {
  const { cardAppApiKey } = useCardAppContext();
  return useMutation<ICardActionsResponse, Error, ICardActionsProps>({
    onError,
    onSuccess,
    mutationFn: async ({ userId, cardId, clientRemark }: ICardActionsProps) => {
      if (!userId || !cardId) throw new Error('Freeze card failed');

      const { data }: { data: ICardActionsResponse } = await axios.post(
        `${API_URL}/banking/${userId}/cards/freeze/${cardId}`,
        {
          ...(clientRemark && { clientRemark }),
        },
        { headers: { 'x-api-key': cardAppApiKey } }
      );

      return data;
    },
  });
};
