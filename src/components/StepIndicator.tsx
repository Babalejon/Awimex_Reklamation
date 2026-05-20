interface Step {
  id: number;
  label: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: Props) {
  return (
    <nav aria-label="Formulärsteg">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all
                    ${isCompleted ? 'border-blue-700 bg-blue-700 text-white' : ''}
                    ${isCurrent ? 'border-blue-700 bg-white text-blue-700 shadow-md' : ''}
                    ${!isCompleted && !isCurrent ? 'border-gray-300 bg-white text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium hidden sm:block ${
                    isCurrent ? 'text-blue-700' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors ${
                    isCompleted ? 'bg-blue-700' : 'bg-gray-200'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
