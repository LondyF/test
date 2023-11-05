import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {uploadPhotoOfId} from '../features/Auth/services/auth-service';

const useUploadPhotoOfId = () =>
  useMutation<
    UploadPhotoOfIdResponse,
    AxiosError<UploadPhotoOfIdResponse>,
    any
  >(
    ({
      apuId,
      lang,
      image,
      rescanFotoId = false,
      refId = 0,
    }: {
      apuId: User['apuId'];
      lang: Language['abbreviation'];
      image: string;
      rescanFotoId: boolean;
      refId: Number;
    }) => uploadPhotoOfId(apuId, lang, image, rescanFotoId, refId),
  );

export default useUploadPhotoOfId;
