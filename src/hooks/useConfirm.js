import { useContext } from 'react';
import ConfirmContext from '@/contexts/ConfirmContext';

/**
 * Hook to access the confirmation dialog
 * @returns {Object} Object containing confirm and close functions
 * @throws {Error} If used outside of ConfirmProvider
 */
export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return context;
};

/**
 * Hook for delete confirmation dialogs
 * @param {Object} options - Default options for the confirmation dialog
 * @returns {Function} Function to show the delete confirmation dialog
 */
export const useConfirmDelete = (options = {}) => {
  const { confirm } = useConfirm();
  
  return (item, customOptions = {}) => {
    const config = {
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this item?',
      confirmText: 'Delete',
      type: 'error',
      showCancel: true,
      ...options,
      ...customOptions,
    };

    if (item?.name) {
      config.message = `Are you sure you want to delete "${item.name}"?`;
    }

    if (item?.details) {
      config.details = [
        { label: 'Type', value: item.type || 'Item' },
        ...(item.details || []),
      ];
    }

    return confirm(config);
  };
};

/**
 * Hook for generic action confirmation dialogs
 * @param {Object} options - Default options for the confirmation dialog
 * @returns {Function} Function to show the action confirmation dialog
 */
export const useConfirmAction = (options = {}) => {
  const { confirm } = useConfirm();
  
  return (action, item, customOptions = {}) => {
    const config = {
      title: `Confirm ${action}`,
      message: `Are you sure you want to ${action.toLowerCase()} this item?`,
      confirmText: action,
      type: 'warning',
      showCancel: true,
      ...options,
      ...customOptions,
    };

    if (item?.name) {
      config.message = `Are you sure you want to ${action.toLowerCase()} "${item.name}"?`;
    }

    if (item?.details) {
      config.details = [
        { label: 'Type', value: item.type || 'Item' },
        ...(item.details || []),
      ];
    }

    return confirm(config);
  };
};
