import request from '@utils/request';

export const fetchTranslationsByAbbr = async (
  lang: Language['abbreviation'],
) => {
  return await request({
    url: `/translate-v2/lang/${lang}`,
    method: 'GET',
  });
};
