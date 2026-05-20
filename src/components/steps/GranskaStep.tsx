import { useState } from 'react';
import { ReklamationFormData } from '../../types';
import SectionCard from '../ui/SectionCard';

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  formData: ReklamationFormData;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (intygChecked: boolean) => void;
  onEditStep: (step: number) => void;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
      <dt className="w-44 shrink-0 text-xs font-semibold text-gray-500 uppercase tracking-wide pt-0.5">{label}</dt>
      <dd className="text-sm text-gray-900 flex-1">{value || '—'}</dd>
    </div>
  );
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
    >
      Redigera
    </button>
  );
}

export default function GranskaStep({ formData, isSubmitting, onBack, onSubmit, onEditStep }: Props) {
  const [intyg, setIntyg] = useState(false);
  const [intygError, setIntygError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intyg) {
      setIntygError('Du behöver intyga att uppgifterna är korrekta innan reklamationen skickas.');
      return;
    }
    onSubmit(intyg);
  };

  const { kunduppgifter, reklamationsrader, bilagor } = formData;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-5">
        <SectionCard
          title="Granska och skicka reklamation"
          description="Kontrollera att informationen stämmer innan du skickar in reklamationen."
        >
          <div className="space-y-6">
            {/* Kunduppgifter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Kunduppgifter</h3>
                <EditButton onClick={() => onEditStep(1)} />
              </div>
              <dl className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-1">
                <SummaryRow label="Kundnummer" value={kunduppgifter.kundnummer} />
                <SummaryRow label="Referensperson" value={kunduppgifter.referensperson} />
                <SummaryRow label="E-postadress" value={kunduppgifter.epostadress} />
                <SummaryRow label="Telefonnummer" value={kunduppgifter.telefonnummer} />
              </dl>
            </div>

            {/* Reklamationsrader */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Reklamationsuppgifter ({reklamationsrader.length} {reklamationsrader.length === 1 ? 'rad' : 'rader'})
                </h3>
                <EditButton onClick={() => onEditStep(2)} />
              </div>
              <div className="space-y-3">
                {reklamationsrader.map((rad, i) => (
                  <div key={rad.id} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-1">
                    <div className="flex items-center gap-2 py-2 border-b border-gray-100">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-xs font-semibold text-gray-600">Rad {i + 1}</span>
                    </div>
                    <dl>
                      <SummaryRow label="Ordernummer" value={rad.ordernummer} />
                      <SummaryRow label="Artikelnummer" value={rad.artikelnummer} />
                      <SummaryRow label="Antal" value={`${rad.reklamerat_antal} st`} />
                      <SummaryRow label="Orsak" value={rad.reklamationsorsak} />
                      <SummaryRow label="Önskad åtgärd" value={rad.onskat_atgard} />
                      <SummaryRow label="Beskrivning" value={rad.beskrivning} />
                    </dl>
                  </div>
                ))}
              </div>
            </div>

            {/* Bilagor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Bilagor ({bilagor.length} {bilagor.length === 1 ? 'fil' : 'filer'})
                </h3>
                <EditButton onClick={() => onEditStep(3)} />
              </div>
              {bilagor.length > 0 ? (
                <ul className="rounded-lg border border-gray-200 bg-gray-50 divide-y divide-gray-100">
                  {bilagor.map(f => (
                    <li key={f.id} className="flex items-center gap-3 px-4 py-2.5">
                      {f.preview ? (
                        <img src={f.preview} alt={f.file.name} className="h-8 w-8 rounded object-cover border border-gray-200 shrink-0" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white shrink-0">
                          <span className="text-xs font-bold text-gray-400">PDF</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-800 truncate">{f.file.name}</p>
                        <p className="text-xs text-gray-400">{formatBytes(f.file.size)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-400">
                  Inga bilagor bifogade.
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Intyg */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <label className="flex gap-3 cursor-pointer items-start">
            <input
              type="checkbox"
              checked={intyg}
              onChange={e => {
                setIntyg(e.target.checked);
                if (e.target.checked) setIntygError('');
              }}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-500 shrink-0"
            />
            <span className="text-sm font-semibold text-gray-800">
              Jag intygar att uppgifterna är korrekta.
            </span>
          </label>
          {intygError && (
            <p className="mt-2 ml-7 text-xs text-red-600 flex items-center gap-1">
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {intygError}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button type="button" onClick={onBack} disabled={isSubmitting} className="btn-secondary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Föregående
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Skickar reklamation...
            </>
          ) : (
            <>
              Skicka reklamation
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
