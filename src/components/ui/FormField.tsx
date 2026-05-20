import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}

export default function FormField({ label, required, helpText, error, htmlFor, children }: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={`form-label ${required ? 'form-label-required' : ''}`}
      >
        {label}
      </label>
      {children}
      {helpText && !error && (
        <p className="form-help">{helpText}</p>
      )}
      {error && (
        <p className="form-error" role="alert">
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
