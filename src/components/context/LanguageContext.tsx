import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zu' | 'xh' | 'af';

type Translations = {
  [key: string]: {
    en: string;
    zu: string;
    xh: string;
    af: string;
  };
};

const translations: Translations = {
  // Header
  discovery: { en: 'Discovery', zu: 'Ukuthola', xh: 'Ukufumanisa', af: 'Ontdekking' },
  myProfile: { en: 'My Profile', zu: 'Iphrofayela Yami', xh: 'Iprofayile Yam', af: 'My Profiel' },
  
  // Discovery Page
  findServices: { en: 'Find Services Near You', zu: 'Thola Izinsizakalo Eduze Kwakho', xh: 'Fumana Iinkonzo Kufuphi Nawe', af: 'Vind Dienste Naby Jou' },
  searchSkill: { en: 'Search by skill...', zu: 'Sesha ngekhono...', xh: 'Khangela ngesakhono...', af: 'Soek volgens vaardigheid...' },
  searchLocation: { en: 'Search by location...', zu: 'Sesha ngendawo...', xh: 'Khangela ngendawo...', af: 'Soek volgens ligging...' },
  allSkills: { en: 'All Skills', zu: 'Wonke Amakhono', xh: 'Zonke Izakhono', af: 'Alle Vaardighede' },
  
  // Provider Cards
  perHour: { en: '/hour', zu: '/ihora', xh: '/iyure', af: '/uur' },
  away: { en: 'away', zu: 'kude', xh: 'kude', af: 'weg' },
  reviews: { en: 'reviews', zu: 'ukubuyekezwa', xh: 'uphononongo', af: 'resensies' },
  viewProfile: { en: 'View Profile', zu: 'Buka Iphrofayela', xh: 'Jonga Iprofayile', af: 'Bekyk Profiel' },
  
  // Profile Pages
  back: { en: 'Back', zu: 'Emuva', xh: 'Emva', af: 'Terug' },
  about: { en: 'About', zu: 'Mayelana', xh: 'Malunga', af: 'Oor' },
  skills: { en: 'Skills', zu: 'Amakhono', xh: 'Izakhono', af: 'Vaardighede' },
  location: { en: 'Location', zu: 'Indawo', xh: 'Indawo', af: 'Ligging' },
  rate: { en: 'Rate', zu: 'Izinga', xh: 'Ixabiso', af: 'Tarief' },
  customerReviews: { en: 'Customer Reviews', zu: 'Ukubuyekezwa Kwamakhasimende', xh: 'Uphononongo Lwabathengi', af: 'Klante Resensies' },
  contactProvider: { en: 'Contact Provider', zu: 'Xhumana Nomhlinzeki', xh: 'Qhagamshelana Nomnikezeli', af: 'Kontak Verskaffer' },
  
  // Customer Profile
  customerProfile: { en: 'Customer Profile', zu: 'Iphrofayela Yekhasimende', xh: 'Iprofayile Yomthengi', af: 'Kliënt Profiel' },
  contactDetails: { en: 'Contact Details', zu: 'Imininingwane Yokuxhumana', xh: 'Iinkcukacha Zoqhagamshelwano', af: 'Kontak Besonderhede' },
  email: { en: 'Email', zu: 'I-imeyili', xh: 'I-imeyile', af: 'E-pos' },
  phone: { en: 'Phone', zu: 'Ifoni', xh: 'Ifowuni', af: 'Telefoon' },
  memberSince: { en: 'Member Since', zu: 'Ilungu Kusukela', xh: 'Ilungu Ukusukela', af: 'Lid Sedert' },
  editProfile: { en: 'Edit Profile', zu: 'Hlela Iphrofayela', xh: 'Hlela Iprofayile', af: 'Redigeer Profiel' },
  
  // Skills
  plumber: { en: 'Plumber', zu: 'Umshini Wamanzi', xh: 'Umchwepheshe Wamanzi', af: 'Loodgieter' },
  electrician: { en: 'Electrician', zu: 'Ugesi', xh: 'Umbane', af: 'Elektrisien' },
  carpenter: { en: 'Carpenter', zu: 'Umbazi', xh: 'Umbazi', af: 'Skrynwerker' },
  gardener: { en: 'Gardener', zu: 'Umlimi', xh: 'Umhlali-gadi', af: 'Tuinier' },
  painter: { en: 'Painter', zu: 'Umdweba', xh: 'Umpeyinti', af: 'Skilder' },
  cleaner: { en: 'Cleaner', zu: 'Umhlanza', xh: 'Umhlambululi', af: 'Skoonmaker' },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}