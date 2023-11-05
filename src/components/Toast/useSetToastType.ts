import { ToastTypes } from './toastTypes';

const toastTypes = {
  [ToastTypes.SUCCESS]: {
    background: 'green',
    title: 'Success',
    icon: '\u2713',
  },
  [ToastTypes.ERROR]: {
    title: 'Error',
    background: 'red',
    icon: '\u00D7',
  },
  [ToastTypes.INFO]: {
    title: 'Info',
    background: '#0096FF',
    icon: '\u0069',
  },
  [ToastTypes.WARNING]: {
    title: 'Warning',
    background: '#ffa112',
    icon: '\u26A0',
  },
};

const useSetToastType = (status: ToastTypes) => {
  return { ...toastTypes[status] };
};

export default useSetToastType;
