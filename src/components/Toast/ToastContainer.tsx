import React, {useState} from 'react';
import {useCallback} from 'react';

import ToastComponent from './Toast';
import {ToastProps} from './toasts';
import {ToastTypes} from './toastTypes';

interface InitContextProps {
  Toast: (message: string, type: ToastTypes, duration?: number) => void;
}

export const ToastContext = React.createContext({} as InitContextProps);

const ToastContainer: React.FC = ({children}) => {
  const [toasts, setToats] = useState<Array<ToastProps>>([]);

  const generateNumber = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const Toast = useCallback(
    (
      message: string,
      type: ToastTypes = ToastTypes.WARNING,
      duration: number = 1500,
    ) => {
      var id = generateNumber();
      setToats(prevToats => {
        let newToasts = [...prevToats, {id, message, type, duration}];
        return newToasts;
      });
    },
    [],
  );

  const hideToast = (id: number) => {
    setToats(prevToats => {
      return prevToats.filter(x => x.id !== id);
    });
  };

  return (
    <React.Fragment>
      <ToastContext.Provider value={{Toast}}>{children}</ToastContext.Provider>
      {toasts.map((toast, index) => (
        <ToastComponent
          key={index}
          index={index}
          hideToast={() => hideToast(toast.id)}
          {...toast}
        />
      ))}
    </React.Fragment>
  );
};

export default ToastContainer;
