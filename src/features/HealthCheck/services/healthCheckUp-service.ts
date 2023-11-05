import request from '@src/utils/request';

export const fetchHealthCheckUpQuestions = async (apuId: number) => {
  return await request({
    url: '/app-rn1/lov/questions',
    method: 'POST',
    data: {
      apuId,
    },
  });
};

export const saveHealthCheckUpQuestions = async (
  apuId: number,
  answers: Array<any>,
) => {
  const response = await request({
    url: '/app-rn1/lov/answers',
    method: 'POST',
    data: {
      apuId,
      answers,
      questionnaireId: 300,
    },
  });

  return response;
};
