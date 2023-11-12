import {useNavigation} from '@react-navigation/core';
import {AxiosError} from 'axios';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import {DeclarationPhoto} from '../screens/NewDeclaration.screen';
import {saveDeclaration} from '../services/declarations-service';
import {SaveDeclarationResponse} from '../types/declarations';

interface variables {
  apuId: number;
  catalogName: string;
  declarationPhotos: DeclarationPhoto[];
}

const useSaveDeclaration = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  return useMutation<SaveDeclarationResponse, AxiosError, variables>({
    mutationFn: ({...values}: variables) =>
      saveDeclaration(
        values.apuId,
        values.catalogName,
        values.declarationPhotos,
      ),
    onSuccess(data) {
      const {
        scan: {status},
      } = data;
      status.status === 0 && navigation.goBack();
      queryClient.invalidateQueries({queryKey: ['declarations']});
    },
  });
};
export default useSaveDeclaration;
