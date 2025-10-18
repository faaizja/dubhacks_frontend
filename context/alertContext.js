import { createContext, useState, useCallback } from "react";
import { nanoid } from "nanoid"; // unique ID for each alert

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((msg, type = "info", duration = 5000) => {
    return new Promise((resolve) => {
      const id = nanoid();
      setAlerts((prev) => [...prev, { id, message: msg, type }]);

      const timer = setTimeout(() => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        resolve();
      }, duration);
    });
  }, []);

  const onClose = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, showAlert, onClose }}>
      {children}
    </AlertContext.Provider>
  );
};
