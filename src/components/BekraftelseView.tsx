import { BekraftelseData } from '../types';

interface Props {
  data: BekraftelseData;
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
      <dt className="w-44 shrink-0 text-xs font-semibold text-gray-500 uppercase tracking-wide pt-0.5">{label}</dt>
      <dd className="text-sm text-gray-900 font-medium">{value}</dd>
    </div>
  );
}

export default function BekraftelseView({ data }: Props) {
  return (
    <div>
      {/* Success header */}
      <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center mb-6">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 border-2 border-green-300">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Reklamationen har mottagits</h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
          Tack. Din reklamation har registrerats hos Awimex International AB. Vi återkommer så snart ärendet har behandlats.
        </p>
      </div>

      {/* Reklamations-ID highlight */}
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Reklamations-ID</p>
            <p className="text-2xl font-bold text-blue-800 tracking-wider font-mono">{data.reklamationsId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">Status</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 border border-blue-300 px-3 py-1 text-sm font-bold text-blue-800">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              Ny
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-blue-600 border-t border-blue-200 pt-3">
          Spara gärna reklamations-ID:t. Det kan användas vid framtida kontakt gällande ärendet.
        </p>
      </div>

      {/* Details */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="text-base font-bold text-gray-900">Ärendeöversikt</h2>
        </div>
        <div className="section-body">
          <dl>
            <DetailRow label="Datum" value={data.datum} />
            <DetailRow label="Tid" value={data.tid} />
            <DetailRow label="Reklamations-ID" value={data.reklamationsId} />
            <DetailRow label="Status" value="Ny" />
            <DetailRow label="Kundnummer" value={data.kunduppgifter.kundnummer} />
            <DetailRow label="Referensperson" value={data.kunduppgifter.referensperson} />
            <DetailRow label="E-postadress" value={data.kunduppgifter.epostadress} />
            <DetailRow label="Telefonnummer" value={data.kunduppgifter.telefonnummer} />
            <DetailRow label="Reklamationsrader" value={`${data.antalRader} ${data.antalRader === 1 ? 'rad' : 'rader'}`} />
            <DetailRow label="Bifogade filer" value={`${data.antalBilagor} ${data.antalBilagor === 1 ? 'fil' : 'filer'}`} />
          </dl>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">Bekräftelse via e-post</p>
            <p className="text-sm text-amber-700 mt-0.5">
              En bekräftelse har skickats till <strong>{data.kunduppgifter.epostadress}</strong>. Kontrollera även skräppost om du inte hittar e-postmeddelandet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
