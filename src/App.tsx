import { useState } from 'react';
import { ReklamationFormData, BekraftelseData, UploadedFile } from './types';
import StepIndicator from './components/StepIndicator';
import KunduppgifterStep from './components/steps/KunduppgifterStep';
import ReklamationsuppgifterStep from './components/steps/ReklamationsuppgifterStep';
import BilageStep from './components/steps/BilageStep';
import GranskaStep from './components/steps/GranskaStep';
import BekraftelseView from './components/BekraftelseView';
import { v4 as uuidv4 } from 'uuid';

const STEPS = [
  { id: 1, label: 'Kunduppgifter' },
  { id: 2, label: 'Reklamation' },
  { id: 3, label: 'Bilagor' },
  { id: 4, label: 'Granska & skicka' },
];

const emptyFormData: ReklamationFormData = {
  kunduppgifter: {
    kundnummer: '',
    referensperson: '',
    epostadress: '',
    telefonnummer: '',
  },
  reklamationsrader: [
    {
      id: uuidv4(),
      ordernummer: '',
      artikelnummer: '',
      reklamerat_antal: '',
      reklamationsorsak: '',
      beskrivning: '',
      onskat_atgard: '',
    },
  ],
  bilagor: [],
  intyg: false,
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ReklamationFormData>(emptyFormData);
  const [bekraftelse, setBekraftelse] = useState<BekraftelseData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateKunduppgifter = (data: ReklamationFormData['kunduppgifter']) => {
    setFormData(prev => ({ ...prev, kunduppgifter: data }));
  };

  const updateReklamationsrader = (data: ReklamationFormData['reklamationsrader']) => {
    setFormData(prev => ({ ...prev, reklamationsrader: data }));
  };

  const updateBilagor = (files: UploadedFile[]) => {
    setFormData(prev => ({ ...prev, bilagor: files }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (intygChecked: boolean) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const now = new Date();
    const reklamationsId = `REC-${now.getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;

    setBekraftelse({
      reklamationsId,
      datum: now.toLocaleDateString('sv-SE'),
      tid: now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
      kunduppgifter: formData.kunduppgifter,
      antalRader: formData.reklamationsrader.length,
      antalBilagor: formData.bilagor.length,
    });

    setFormData(prev => ({ ...prev, intyg: intygChecked }));
    setIsSubmitting(false);
  };

  if (bekraftelse) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <BekraftelseView data={bekraftelse} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        <div className="mt-8">
          {currentStep === 1 && (
            <KunduppgifterStep
              data={formData.kunduppgifter}
              onSave={(data) => {
                updateKunduppgifter(data);
                goToStep(2);
              }}
            />
          )}
          {currentStep === 2 && (
            <ReklamationsuppgifterStep
              data={formData.reklamationsrader}
              onSave={(data) => {
                updateReklamationsrader(data);
                goToStep(3);
              }}
              onBack={() => goToStep(1)}
            />
          )}
          {currentStep === 3 && (
            <BilageStep
              files={formData.bilagor}
              onChange={updateBilagor}
              onNext={() => goToStep(4)}
              onBack={() => goToStep(2)}
            />
          )}
          {currentStep === 4 && (
            <GranskaStep
              formData={formData}
              isSubmitting={isSubmitting}
              onBack={() => goToStep(3)}
              onSubmit={handleSubmit}
              onEditStep={goToStep}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-blue-800 tracking-tight">AWIMEX</div>
          <div className="text-xs text-gray-500 font-medium">International AB</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-gray-800">Reklamationsformulär</div>
          <div className="text-xs text-gray-500">Registrera ny reklamation</div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Awimex International AB · Alla rättigheter förbehållna
      </div>
    </footer>
  );
}
