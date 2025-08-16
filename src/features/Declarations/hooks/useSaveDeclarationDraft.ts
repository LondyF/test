import {useMutation, useQueryClient} from '@tanstack/react-query';

import {saveDeclarationDraft} from '../services/declarations-service';
import {DeclarationLine} from '../types/declarations';

const useSaveDeclarationDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      sesId: string;
      apuId: number;
      lines: DeclarationLine[];
    }) => saveDeclarationDraft(variables),
    onSuccess: async (_, {apuId, sesId}) => {
      await queryClient.invalidateQueries({
        queryKey: ['declaration', apuId, sesId],
      });
      await queryClient.invalidateQueries({queryKey: ['declarations']});
    },
  });
};

export default useSaveDeclarationDraft;
