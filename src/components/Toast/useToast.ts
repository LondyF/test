import { useContext } from 'react';
import { ToastContext } from './ToastContainer';

const useToast = () => useContext(ToastContext).Toast;

export default useToast;
