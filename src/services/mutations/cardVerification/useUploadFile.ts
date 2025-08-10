import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TGenericMutation } from '../../../types/globals';

/* Types */
export type TUploadFileProps = {
  file: File;
};

export type TUploadFileResponse = {
  code: number;
  msg: string;
  success: boolean;
  data: {
    fileId: string;
  };
};

/* Hook */
export const useUploadFile = ({
  onError,
  onSuccess,
}: TGenericMutation<TUploadFileResponse>) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useMutation<TUploadFileResponse, Error, TUploadFileProps>({
    onError,
    onSuccess,
    mutationFn: async ({ file }: TUploadFileProps) => {
      if (!file) throw new Error('File is required');

      const formData = new FormData();
      formData.append('file', file);

      const { data }: { data: TUploadFileResponse } = await axios.post(
        `${cardAppApiUrl}/banking/file/upload`,
        formData,
        {
          headers: {
            'x-api-key': cardAppApiKey,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return data;
    },
  });
};
