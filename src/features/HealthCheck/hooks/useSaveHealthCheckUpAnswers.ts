import {ToastTypes} from '@src/components/Toast/toastTypes';
import useToast from '@src/components/Toast/useToast';
import {useMutation} from '@tanstack/react-query';
import {saveHealthCheckUpQuestions} from '../services/healthCheckUp-service';

const useSaveHealthCheckUpAnswers = () => {
  const Toast = useToast();
  return useMutation({
    mutationFn: ({...values}: {apuId: number; answers: Array<any>}) =>
      saveHealthCheckUpQuestions(values.apuId, values.answers),

    onError() {
      Toast('Something went wrong', ToastTypes.ERROR);
    },

    onSuccess() {
      Toast('Successfully saved answers', ToastTypes.SUCCESS);
    },
  });
};

export default useSaveHealthCheckUpAnswers;
