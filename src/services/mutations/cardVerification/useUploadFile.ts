import { useMutation } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import axios from 'axios';
import type { TBaseResponse, TGenericMutation } from '../../../types';

/* Response */
export type TUploadFileResponse = TBaseResponse & {
  data: {
    fileId: string;
  };
};

/* Props */
export type TUploadFileProps = {
  file: File;
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
        `${cardAppApiUrl}/v1/banking/file/upload`,
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
