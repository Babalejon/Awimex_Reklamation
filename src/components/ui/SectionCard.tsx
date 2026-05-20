import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function SectionCard({ title, description, children, action }: SectionCardProps) {
  return (
    <div className="section-card">
      <div className="section-header">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
      <div className="section-body">
        {children}
      </div>
    </div>
  );
}
