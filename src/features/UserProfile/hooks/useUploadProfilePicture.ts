import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';

import {uploadProfilePicture} from '../services/userProfile-service';
import {deleteTmpFolder} from '@src/utils';

const useUploadProiflePicture = () =>
  useMutation<
    UploadPhotoOfIdResponse,
    AxiosError<UploadPhotoOfIdResponse>,
    any
  >(
    ({apuId, image}: {apuId: number; image: string}) =>
      uploadProfilePicture(apuId, image),
    {
      onSuccess() {
        deleteTmpFolder();
      },
    },
  );
export default useUploadProiflePicture;
