export interface Kunduppgifter {
  kundnummer: string;
  referensperson: string;
  epostadress: string;
  telefonnummer: string;
}

export interface ReklamationsRad {
  id: string;
  ordernummer: string;
  artikelnummer: string;
  reklamerat_antal: string;
  reklamationsorsak: string;
  beskrivning: string;
  onskat_atgard: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  error?: string;
}

export interface ReklamationFormData {
  kunduppgifter: Kunduppgifter;
  reklamationsrader: ReklamationsRad[];
  bilagor: UploadedFile[];
  intyg: boolean;
}

export interface BekraftelseData {
  reklamationsId: string;
  datum: string;
  tid: string;
  kunduppgifter: Kunduppgifter;
  antalRader: number;
  antalBilagor: number;
}

export const REKLAMATIONSORSAKER = [
  'Fel vara levererad',
  'Transportskada',
  'Saknat antal',
  'Kvalitetsfel',
  'Fel artikelnummer',
  'Synlig produktskada',
  'Fel märkning eller dokumentation',
  'Försenad eller ofullständig leverans',
  'Övrigt',
] as const;

export const ONSKAT_ATGARD = [
  'Ersättningsvara',
  'Kredit',
  'Reparation',
  'Kompletterande leverans',
  'Kontakt från säljare',
  'Teknisk bedömning',
  'Annan åtgärd',
] as const;

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_FILES = 10;
