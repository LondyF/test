import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reactotronZustand from 'reactotron-plugin-zustand';

import useAuthStore from '@stores/useAuthStore';
import usePinStore from '@stores/usePinStore';
import useGenericPopUpStore from '@stores/useGenericPopUpStore';

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'MiSaluMobileApp',
  })
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate|logs|generate_204/,
    },
    overlay: false,
  })
  .use(
    reactotronZustand({
      omitFunctionKeys: true,
      stores: [
        {name: 'auth', store: useAuthStore},
        {name: 'pin', store: usePinStore},
        {name: 'genericPopUp', store: useGenericPopUpStore},
      ],
    }),
  )
  .connect();

const globalWithTron = globalThis as typeof globalThis & {
  tron: typeof Reactotron;
};

globalWithTron.tron = Reactotron;
console.tron = Reactotron;

Reactotron.log?.('Reactotron connected to MiSaluMobileApp');

export default Reactotron;
