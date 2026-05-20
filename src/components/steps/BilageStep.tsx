import { useCallback, useRef, useState } from 'react';
import { UploadedFile, ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILES } from '../../types';
import SectionCard from '../ui/SectionCard';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string): string {
  if (type === 'application/pdf') return 'PDF';
  return 'IMG';
}

export default function BilageStep({ files, onChange, onNext, onBack }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    setGlobalError('');

    const fileArray = Array.from(newFiles);
    const validFiles: UploadedFile[] = [];
    let errorMsg = '';

    if (files.length + fileArray.length > MAX_FILES) {
      setGlobalError(`Du kan maximalt ladda upp ${MAX_FILES} filer.`);
      return;
    }

    for (const f of fileArray) {
      if (!ALLOWED_FILE_TYPES.includes(f.type)) {
        errorMsg = 'Filtypen stöds inte. Tillåtna format är JPG, PNG, HEIC och PDF.';
        continue;
      }
      if (f.size > MAX_FILE_SIZE) {
        errorMsg = 'Filen är för stor. Maxstorlek är 10 MB.';
        continue;
      }
      validFiles.push({
        id: uuidv4(),
        file: f,
        preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
      });
    }

    if (errorMsg) setGlobalError(errorMsg);
    if (validFiles.length > 0) onChange([...files, ...validFiles]);
  }, [files, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const removeFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file?.preview) URL.revokeObjectURL(file.preview);
    onChange(files.filter(f => f.id !== id));
  };

  return (
    <div>
      <SectionCard
        title="Bilagor och dokumentation"
        description="Bifoga gärna bilder eller dokument som visar felet, skadan, produkten, emballaget eller annan relevant information."
      >
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed
            cursor-pointer transition-all py-10 px-6 text-center
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.heic,.pdf"
            className="sr-only"
            onChange={e => processFiles(e.target.files)}
          />
          <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-3 ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <svg className={`h-6 w-6 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-700">Ladda upp bilder eller dokument</p>
          <p className="text-sm text-gray-500 mt-1">
            Dra och släpp filer här eller <span className="text-blue-600 underline">klicka för att välja filer</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Tillåtna filformat: JPG, PNG, HEIC och PDF · Max 10 MB per fil · Maximalt {MAX_FILES} filer
          </p>
        </div>

        {globalError && (
          <div className="mt-3 flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2">
            <svg className="h-4 w-4 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-red-700">{globalError}</p>
          </div>
        )}

        {files.length > 0 ? (
          <div className="mt-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Uppladdade filer ({files.length}/{MAX_FILES})
            </p>
            <ul className="space-y-2">
              {files.map(f => (
                <li key={f.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
                  {f.preview ? (
                    <img src={f.preview} alt={f.file.name} className="h-10 w-10 rounded object-cover border border-gray-200 shrink-0" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded border border-gray-200 bg-gray-100 shrink-0">
                      <span className="text-xs font-bold text-gray-500">{getFileIcon(f.file.type)}</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{f.file.name}</p>
                    <p className="text-xs text-gray-400">{formatBytes(f.file.size)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-xs font-medium text-green-700">
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Klar
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      className="rounded p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Ta bort fil"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 text-center text-sm text-gray-400">
            Inga filer valda. Du kan fortsätta utan att bifoga filer.
          </p>
        )}
      </SectionCard>

      <div className="mt-6 flex items-center justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Föregående
        </button>
        <button type="button" onClick={onNext} className="btn-primary">
          Granska reklamation
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
