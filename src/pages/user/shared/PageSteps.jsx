export function PageSteps({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-6 text-sm font-medium">
      {steps.map((step, idx) => {
        const isActive = step.active;
        const isLast = idx === steps.length - 1;
        return (
          <div key={step.label} className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.number}
            </span>
            <span className={isActive ? "text-blue-600" : "text-gray-400"}>
              {step.label}
            </span>
            {!isLast && <div className="w-8 h-px bg-gray-300 ml-4" />}
          </div>
        );
      })}
    </div>
  );
}
