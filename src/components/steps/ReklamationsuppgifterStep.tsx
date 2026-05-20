import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ReklamationsRad, REKLAMATIONSORSAKER, ONSKAT_ATGARD } from '../../types';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';
import { v4 as uuidv4 } from 'uuid';

const radSchema = z.object({
  id: z.string(),
  ordernummer: z.string().min(1, 'Ange ordernummer.'),
  artikelnummer: z.string().min(1, 'Ange artikelnummer.'),
  reklamerat_antal: z.string().min(1, 'Ange ett giltigt antal.').refine(
    v => /^\d+$/.test(v) && parseInt(v) > 0,
    'Ange ett giltigt antal.'
  ),
  reklamationsorsak: z.string().min(1, 'Välj en reklamationsorsak.'),
  beskrivning: z.string().min(10, 'Beskriv reklamationen med minst 10 tecken.'),
  onskat_atgard: z.string().min(1, 'Välj önskad åtgärd.'),
});

const schema = z.object({
  reklamationsrader: z.array(radSchema).min(1),
});

interface FormValues {
  reklamationsrader: ReklamationsRad[];
}

interface Props {
  data: ReklamationsRad[];
  onSave: (data: ReklamationsRad[]) => void;
  onBack: () => void;
}

export default function ReklamationsuppgifterStep({ data, onSave, onBack }: Props) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { reklamationsrader: data },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'reklamationsrader' });

  const onSubmit = (values: FormValues) => {
    onSave(values.reklamationsrader);
  };

  const addRow = () => {
    append({
      id: uuidv4(),
      ordernummer: '',
      artikelnummer: '',
      reklamerat_antal: '',
      reklamationsorsak: '',
      beskrivning: '',
      onskat_atgard: '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <SectionCard
        title="Reklamationsuppgifter"
        description="Ange vilken order och artikel reklamationen gäller. Du kan lägga till flera rader om reklamationen gäller flera artiklar."
      >
        <div className="space-y-6">
          {fields.map((field, index) => {
            const rowErrors = errors.reklamationsrader?.[index];
            return (
              <div key={field.id} className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-800">
                      Reklamationsrad {index + 1}
                    </h3>
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn-danger"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Ta bort rad
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    label="Ordernummer"
                    required
                    helpText="Ange ordernumret som reklamationen gäller."
                    error={rowErrors?.ordernummer?.message}
                    htmlFor={`ordernummer-${index}`}
                  >
                    <input
                      id={`ordernummer-${index}`}
                      type="text"
                      placeholder="Exempel: 456789"
                      className={`form-input ${rowErrors?.ordernummer ? 'form-input-error' : ''}`}
                      {...register(`reklamationsrader.${index}.ordernummer`)}
                    />
                  </FormField>

                  <FormField
                    label="Artikelnummer"
                    required
                    helpText="Ange artikelnumret för produkten som reklameras."
                    error={rowErrors?.artikelnummer?.message}
                    htmlFor={`artikelnummer-${index}`}
                  >
                    <input
                      id={`artikelnummer-${index}`}
                      type="text"
                      placeholder="Exempel: AWX-10025"
                      className={`form-input ${rowErrors?.artikelnummer ? 'form-input-error' : ''}`}
                      {...register(`reklamationsrader.${index}.artikelnummer`)}
                    />
                  </FormField>

                  <FormField
                    label="Reklamerat antal"
                    required
                    helpText="Ange antal enheter som reklamationen gäller."
                    error={rowErrors?.reklamerat_antal?.message}
                    htmlFor={`reklamerat-antal-${index}`}
                  >
                    <input
                      id={`reklamerat-antal-${index}`}
                      type="number"
                      min="1"
                      placeholder="Exempel: 2"
                      className={`form-input ${rowErrors?.reklamerat_antal ? 'form-input-error' : ''}`}
                      {...register(`reklamationsrader.${index}.reklamerat_antal`)}
                    />
                  </FormField>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Reklamationsorsak"
                    required
                    helpText="Välj den orsak som bäst beskriver reklamationen."
                    error={rowErrors?.reklamationsorsak?.message}
                    htmlFor={`reklamationsorsak-${index}`}
                  >
                    <select
                      id={`reklamationsorsak-${index}`}
                      className={`form-input ${rowErrors?.reklamationsorsak ? 'form-input-error' : ''}`}
                      {...register(`reklamationsrader.${index}.reklamationsorsak`)}
                    >
                      <option value="">Välj orsak</option>
                      {REKLAMATIONSORSAKER.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField
                    label="Önskad åtgärd"
                    required
                    helpText="Ange hur ni önskar att reklamationen hanteras."
                    error={rowErrors?.onskat_atgard?.message}
                    htmlFor={`onskat-atgard-${index}`}
                  >
                    <select
                      id={`onskat-atgard-${index}`}
                      className={`form-input ${rowErrors?.onskat_atgard ? 'form-input-error' : ''}`}
                      {...register(`reklamationsrader.${index}.onskat_atgard`)}
                    >
                      <option value="">Välj önskad åtgärd</option>
                      {ONSKAT_ATGARD.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <div className="mt-4">
                  <FormField
                    label="Beskrivning av reklamationen"
                    required
                    helpText="Beskriv problemet så tydligt som möjligt. Det hjälper oss att hantera ärendet snabbare."
                    error={rowErrors?.beskrivning?.message}
                    htmlFor={`beskrivning-${index}`}
                  >
                    <textarea
                      id={`beskrivning-${index}`}
                      rows={3}
                      placeholder="Beskriv kort vad som har hänt och vad som är fel."
                      className={`form-input resize-none ${rowErrors?.beskrivning ? 'form-input-error' : ''}`}
                      {...register(`reklamationsrader.${index}.beskrivning`)}
                    />
                  </FormField>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={addRow}
            className="btn-secondary w-full"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Lägg till reklamationsrad
          </button>
        </div>
      </SectionCard>

      <div className="mt-6 flex items-center justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Föregående
        </button>
        <button type="submit" className="btn-primary">
          Nästa steg
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
