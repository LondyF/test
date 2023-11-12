import {useQuery} from '@tanstack/react-query';
import {fetchHealthCheckUpQuestions} from '../services/healthCheckUp-service';
import {GetHealthCheckUpQuestionsResponse} from '../types/healthCheck';

const useFetchHealthCheckUpQuestions = (apuId: number) =>
  useQuery<GetHealthCheckUpQuestionsResponse>({
    queryKey: ['myHealthCheckUp'],
    queryFn: () => fetchHealthCheckUpQuestions(apuId),
  });

export default useFetchHealthCheckUpQuestions;
