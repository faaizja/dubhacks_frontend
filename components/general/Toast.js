import React, { useContext, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  FiInfo,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
} from "react-icons/fi";

const toastStyles = {
  info: "bg-blue-600 border-blue-500",
  success: "bg-green-600 border-green-500",
  warning: "bg-yellow-600 border-yellow-500 text-black",
  error: "bg-red-600 border-red-500",
};

const icons = {
  info: <FiInfo />,
  success: <FiCheckCircle />,
  warning: <FiAlertTriangle />,
  error: <FiXCircle />,
};

export default function Toast() {
  const { alerts, onClose } = useContext(AlertContext);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed top-2 right-2 lg:top-4 lg:right-4 z-50 flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            className={`
              px-4 py-2 rounded-lg text-white flex items-center gap-2 lg:gap-3 shadow-lg border transition-colors
              ${toastStyles[alert.type]}
            `}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-xs">{icons[alert.type]}</span>
            <span className="text-xs dm-sans-regular">{alert.message}</span>
            <button onClick={() => onClose(alert.id)} className="ml-2">
              <X className="w-3 h-3 lg:w-4 lg:h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
