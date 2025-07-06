import {useMutation, useQueryClient} from '@tanstack/react-query';

import {submitDeclaration} from '../services/declarations-service';
import {DeclarationLine} from '../types/declarations';

const useSubmitDeclaration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      apuId: number;
      sesId: string;
      lines: DeclarationLine[];
    }) => {
      return submitDeclaration(variables);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['declarations']});
    },
  });
};

export default useSubmitDeclaration;
