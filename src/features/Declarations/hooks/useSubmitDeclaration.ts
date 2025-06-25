import {useMutation} from '@tanstack/react-query';

import {submitDeclaration} from '../services/declarations-service';
import {DeclarationLine} from '../types/declarations';

const useSubmitDeclaration = () => {
  return useMutation({
    mutationFn: async (variables: {
      apuId: number;
      sesId: string;
      lines: DeclarationLine[];
    }) => {
      return submitDeclaration(variables);
    },
  });
};

export default useSubmitDeclaration;
