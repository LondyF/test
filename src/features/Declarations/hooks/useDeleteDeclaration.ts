import {useMutation, useQueryClient} from '@tanstack/react-query';

import {deleteDeclaration} from '../services/declarations-service';
import {ToastTypes} from '@src/components/Toast/toastTypes';
import useToast from '@src/components/Toast/useToast';

const useDeleteDeclaration = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (variables: {apuId: number; sesId: string}) =>
      deleteDeclaration(variables),
    onSuccess: () => {
      toast('Declaration deleted successfully', ToastTypes.SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ['declarations'],
      });
    },
    onError: () => {
      toast('Error deleting declaration', ToastTypes.ERROR);
    },
  });
};

export default useDeleteDeclaration;
