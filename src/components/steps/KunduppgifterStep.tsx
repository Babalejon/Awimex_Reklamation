import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Kunduppgifter } from '../../types';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';

const schema = z.object({
  kundnummer: z.string().min(1, 'Ange ett giltigt kundnummer.'),
  referensperson: z.string().min(1, 'Ange namn på referensperson.'),
  epostadress: z.string().min(1, 'Ange en giltig e-postadress.').email('Ange en giltig e-postadress.'),
  telefonnummer: z.string().min(1, 'Ange ett giltigt telefonnummer.'),
});

interface Props {
  data: Kunduppgifter;
  onSave: (data: Kunduppgifter) => void;
}

export default function KunduppgifterStep({ data, onSave }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<Kunduppgifter>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  return (
    <form onSubmit={handleSubmit(onSave)} noValidate>
      <SectionCard
        title="Kunduppgifter"
        description="Fyll i dina kontaktuppgifter så att vi kan koppla reklamationen till rätt kund och återkomma med besked."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="Kundnummer"
            required
            helpText="Ange ert kundnummer hos Awimex International AB."
            error={errors.kundnummer?.message}
            htmlFor="kundnummer"
          >
            <input
              id="kundnummer"
              type="text"
              placeholder="Exempel: 12345"
              autoComplete="off"
              className={`form-input ${errors.kundnummer ? 'form-input-error' : ''}`}
              {...register('kundnummer')}
            />
          </FormField>

          <FormField
            label="Referensperson"
            required
            helpText="Ange personen vi kan kontakta angående reklamationen."
            error={errors.referensperson?.message}
            htmlFor="referensperson"
          >
            <input
              id="referensperson"
              type="text"
              placeholder="För- och efternamn"
              autoComplete="name"
              className={`form-input ${errors.referensperson ? 'form-input-error' : ''}`}
              {...register('referensperson')}
            />
          </FormField>

          <FormField
            label="E-postadress"
            required
            helpText="Bekräftelse och återkoppling skickas till denna e-postadress."
            error={errors.epostadress?.message}
            htmlFor="epostadress"
          >
            <input
              id="epostadress"
              type="email"
              placeholder="namn@foretag.se"
              autoComplete="email"
              className={`form-input ${errors.epostadress ? 'form-input-error' : ''}`}
              {...register('epostadress')}
            />
          </FormField>

          <FormField
            label="Telefonnummer"
            required
            helpText="Ange ett telefonnummer där vi kan nå dig vid frågor."
            error={errors.telefonnummer?.message}
            htmlFor="telefonnummer"
          >
            <input
              id="telefonnummer"
              type="tel"
              placeholder="Exempel: 070-123 45 67"
              autoComplete="tel"
              className={`form-input ${errors.telefonnummer ? 'form-input-error' : ''}`}
              {...register('telefonnummer')}
            />
          </FormField>
        </div>
      </SectionCard>

      <div className="mt-6 flex justify-end">
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
