// src/hooks/useNotification.js
import { useState } from 'react';

const useNotification = (duration = 3000) => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    
    // Auto-hide after duration
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, duration);
  };

  const hideNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };

  return {
    notification,
    showNotification,
    hideNotification
  };
};

export default useNotification;