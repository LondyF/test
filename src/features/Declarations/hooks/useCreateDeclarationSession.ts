import {useMutation, useQueryClient} from '@tanstack/react-query';

import {createDeclarationSession} from '../services/declarations-service';

const useCreateDeclarationSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      apuId: number;
      vkcId: number;
      sqArtId: number;
      bedrag: number;
      datum: string;
      lndKde: string;
      currency: string;
      imageBase64?: string;
    }) => createDeclarationSession(variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['declarations']});
    },
  });
};

export default useCreateDeclarationSession;
