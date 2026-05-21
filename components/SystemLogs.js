const logs = [
  {
    id: 1,
    type: "info",
    message: "Dr. Sarah Ahmed was added by Admin.",
    time: "2 Mins Ago",
  },
  {
    id: 2,
    type: "success",
    message: "Receptionist Tanvir Hasan was successfully registered.",
    time: "10 Mins Ago",
  },
  {
    id: 3,
    type: "warning",
    message: "Generator maintenance due in 48 hours.",
    time: "4 Hours Ago",
  },
];

export default function SystemLogs() {
  const iconStyles = {
    info: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01"
          />
        </svg>
      ),
    },
    success: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    warning: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01"
          />
        </svg>
      ),
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h4 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
        System Logs
      </h4>

      <div className="space-y-6">
        {logs.map((log) => {
          const style = iconStyles[log.type];

          return (
            <div key={log.id} className="flex gap-4">
              <div
                className={`w-8 h-8 rounded-full ${style.bg} ${style.text} flex-shrink-0 flex items-center justify-center`}
              >
                {style.icon}
              </div>

              <div>
                <p className="text-xs font-bold leading-tight text-gray-900 dark:text-white">
                  {log.message}
                </p>

                <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">
                  {log.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}