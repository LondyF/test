import {useQuery} from '@tanstack/react-query';
import {fetchTranslationsByAbbr} from '@services/translation-service';

const useFetchTranslations = (abbr: Language['abbreviation']) =>
  useQuery({
    queryKey: ['translations', abbr],
    queryFn: () => fetchTranslationsByAbbr(abbr),
    enabled: false,
  });

export default useFetchTranslations;
