import {getMyMedications} from '@src/features/Medication/services/medication-service';
import {useQuery} from '@tanstack/react-query';
import {GetMyMedicationsResponse} from '../types/medication';

const useFetchMyMedications = (apuId: number) =>
  useQuery<GetMyMedicationsResponse>('myMedication', () =>
    getMyMedications(apuId),
  );

export default useFetchMyMedications;
