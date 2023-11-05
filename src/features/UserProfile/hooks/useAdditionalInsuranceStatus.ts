import {InsuranceStatus} from '@src/types/validationStatus';

const additionalInsuranceStatus = {
  [InsuranceStatus.PENDING]: {
    checkmarkColor: '#FFAE42',
  },
  [InsuranceStatus.VALIDATED]: {
    checkmarkColor: 'green',
  },
  [InsuranceStatus.NO_ADDITIONAL_INSURANCE]: {
    checkmarkColor: 'red',
  },
};

const useAdditionalAInsuranceStatus = (status: InsuranceStatus) => {
  return {...additionalInsuranceStatus[status]};
};

export default useAdditionalAInsuranceStatus;
