import { createContext, useCallback, useRef } from 'react';
import { useTheme } from '@mui/material';
import ConfirmDialog from '@/components/Admin/ConfirmDialog/page';

export const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const confirmRef = useRef();
  const theme = useTheme();

  const confirm = useCallback((config) => {
    if (!confirmRef.current) return Promise.resolve(false);
    return confirmRef.current.show(config);
  }, []);

  const close = useCallback(() => {
    if (confirmRef.current) {
      confirmRef.current.hide();
    }
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm, close, theme }}>
      {children}
      <ConfirmDialog ref={confirmRef} />
    </ConfirmContext.Provider>
  );
};

export default ConfirmContext;
