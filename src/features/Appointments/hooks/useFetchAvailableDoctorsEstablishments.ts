import {useQuery} from '@tanstack/react-query';

import {GetAvailableDoctorEstablishmentResponse} from '../types/spots';
import {fetchAvailableDoctorEstablishments} from '../services/appointments-services';

const useFetchAvailableDoctorEstasblishments = (apuId: number) =>
  useQuery<GetAvailableDoctorEstablishmentResponse>(
    'availableDoctorEstablishments',
    () => fetchAvailableDoctorEstablishments(apuId),
  );

export default useFetchAvailableDoctorEstasblishments;
