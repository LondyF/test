import { create } from 'zustand';

type GenericPopUpStore = {
  popUpType: 'WARNING' | 'INFO';
  popUpTitle: string;
  popUpBody: string;
  popUpBodyTwo: string;
  popUpPageToDisplay: string;
  buttonType: number;
  isPopUpVisible: boolean;
  setPopUpProps: Function;
  setPopUpVisibility: Function;
};

const usePinStore = create<GenericPopUpStore>(set => ({
  popUpType: 'INFO',
  popUpTitle: '',
  popUpBody: '',
  popUpBodyTwo: '',
  popUpPageToDisplay: 'Dashboard',
  buttonType: 1,
  isPopUpVisible: false,
  setPopUpProps: ({
    popUpTitle,
    popUpBody,
    popUpBodyTwo,
    popUpType,
    isPopUpVisible,
    buttonType,
  }: {
    popUpTitle: string;
    popUpBody: string;
    popUpBodyTwo: string;
    popUpType: 'WARNING' | 'INFO';
    isPopUpVisible: boolean;
    buttonType: number;
  }) =>
    set(() => ({
      popUpTitle,
      popUpType,
      popUpBody,
      popUpBodyTwo,
      isPopUpVisible,
      buttonType,
    })),
  setPopUpVisibility: (isPopUpVisible: boolean) =>
    set(() => ({
      isPopUpVisible,
    })),
}));

export default usePinStore;
