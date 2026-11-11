import {useQuery} from '@tanstack/react-query';

import {FALLBACK_PHONE_COUNTRIES, PhoneCountry} from '@src/constants';
import {toPhoneCountries} from '@helpers/phoneNumber';
import {fetchPhoneCountries} from '@services/lov-service';

type FetchPhoneCountriesResponse = {
  data?: Array<LovPhoneCountry>;
};

const PHONE_COUNTRIES_STALE_TIME = 1000 * 60 * 60;

const fallbackPhoneCountries = toPhoneCountries(FALLBACK_PHONE_COUNTRIES);

const selectPhoneCountries = (response: FetchPhoneCountriesResponse) =>
  Array.isArray(response?.data) ? toPhoneCountries(response.data) : [];

const usePhoneCountries = (): Array<PhoneCountry> => {
  const {data} = useQuery({
    queryKey: ['phoneCountries'],
    queryFn: () =>
      fetchPhoneCountries() as Promise<FetchPhoneCountriesResponse>,
    select: selectPhoneCountries,
    staleTime: PHONE_COUNTRIES_STALE_TIME,
  });

  return data?.length ? data : fallbackPhoneCountries;
};

export default usePhoneCountries;
