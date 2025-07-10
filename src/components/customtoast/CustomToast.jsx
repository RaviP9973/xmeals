import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = "short") => {
    const id = Date.now();

    const durationMap = {
      short: 1500,
      medium: 3500,
      long: 5000,
    };

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, durationMap[duration] || 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-16 inset-x-0 flex flex-col items-center z-[9999] space-y-3 pointer-events-none poppins-regular">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-fadeSlideUp px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm border border-white/10 min-w-[180px] text-center
              ${
                toast.type === "success"
                  ? "bg-white/80 text-green-700"
                  : toast.type === "error"
                  ? "bg-white/80 text-red-700"
                  : "bg-white/80 text-slate-800"
              }
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
          }
          50% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          
          100% {
            opacity: 0;
            transform: translateY(-10px) scale(0.98);
          }
        }

        .animate-fadeSlideUp {
          animation: fadeSlideUp 2.5s ease-in-out forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};
