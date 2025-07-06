import {useMutation} from '@tanstack/react-query';
import {saveDeclarationPhoto} from '../services/declarations-service';
import {useQueryClient} from '@tanstack/react-query';

const useSaveDeclarationPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDeclarationPhoto,
    onSuccess: (_, {apuId, sesId}) => {
      queryClient.invalidateQueries({queryKey: ['declarations']});
      queryClient.invalidateQueries({queryKey: ['declaration', apuId, sesId]});
    },
  });
};

export default useSaveDeclarationPhoto;
