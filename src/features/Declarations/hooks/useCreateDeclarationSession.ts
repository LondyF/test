import {useMutation} from '@tanstack/react-query';

import {createDeclarationSession} from '../services/declarations-service';

const useCreateDeclarationSession = () =>
  useMutation({
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
  });

export default useCreateDeclarationSession;
