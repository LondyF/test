import { create } from 'zustand';

type PinStore = {
  pinTitle: string;
  setPinTitle: Function;
  resetPinTitle: Function;
};

const DEFAULT_PIN_TITLE = 'Enter your pin...';

const usePinStore = create<PinStore>(set => ({
  pinTitle: DEFAULT_PIN_TITLE,
  setPinTitle: (pinTitle: string) =>
    set(() => ({
      pinTitle,
    })),
  resetPinTitle: () =>
    set(() => ({
      pinTitle: DEFAULT_PIN_TITLE,
    })),
}));

export default usePinStore;
