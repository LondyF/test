import {useMutation} from '@tanstack/react-query';

import {addDeclarationLines} from '../services/declarations-service';
import {DeclarationLine} from '../types/declarations';

const useSubmitDeclaration = () => {
  return useMutation({
    mutationFn: async (variables: {
      apuId: number;
      sesId: string;
      lines: DeclarationLine[];
    }) => {
      return addDeclarationLines(variables);
    },
  });
};

export default useSubmitDeclaration;
