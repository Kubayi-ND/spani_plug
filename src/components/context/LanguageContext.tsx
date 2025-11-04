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
  // Navigation
  login: { en: 'Login', zu: 'Ngena', xh: 'Ngena', af: 'Teken aan' },
  signup: { en: 'Sign Up', zu: 'Bhalisa', xh: 'Bhalisa', af: 'Teken op' },
  logout: { en: 'Logout', zu: 'Phuma', xh: 'Phuma', af: 'Teken uit' },
  profile: { en: 'Profile', zu: 'Iphrofayela', xh: 'Iprofayile', af: 'Profiel' },
  notifications: { en: 'Notifications', zu: 'Izaziso', xh: 'Izaziso', af: 'Kennisgewings' },
  community: { en: 'Community', zu: 'Umphakathi', xh: 'Uluntu', af: 'Gemeenskap' },
  findServices: { en: 'Find Services', zu: 'Thola Izinsizakalo', xh: 'Fumana Iinkonzo', af: 'Vind Dienste' },
  
  // Landing Page
  heroTitle: { en: 'Connect with Trusted Service Providers', zu: 'Xhumana Nabanikezi Bezinsizakalo Abathembekile', xh: 'Qhagamshelana Nabanikezi Beenkonzo Abathembekileyo', af: 'Koppel met Betroubare Diensverskaffers' },
  heroSubtitle: { en: "South Africa's first formal marketplace for skilled and informal skills workers. Find your next service provider with just one click.", zu: "Imakethe yokuqala esemthethweni yaseNingizimu Afrika yabasebenzi abanobuchule kanye nabangekho emthethweni. Thola umhlinzeki wakho wesevisi ngesenzo esisodwa.", xh: "Intlolelo yokuqala esemthethweni yaseMzantsi Afrika yabasebenzi abanezakhono kunye nabangekho emthethweni. Fumana umnikezeli wenkonzo yakho ngocofa kunye.", af: "Suid-Afrika se eerste formele markplek vir geskoolde en informele vaardighede werkers. Vind jou volgende diensverskaffer met net een klik." },
  joinAsProvider: { en: 'Join as Provider', zu: 'Joyina Njengomhlinzeki', xh: 'Joyina Njengomnikezeli', af: 'Sluit aan as Verskaffer' },
  
  // Features Section
  ultimateConvenience: { en: 'Ultimate Convenience', zu: 'Ukudaduka Okuphelele', xh: 'Ulula Olukhulu', af: 'Uiterste Gerief' },
  ultimateConvenienceDesc: { en: 'Spani Plug makes finding, hiring, and paying skilled workers effortless. No long calls or travel — just search, connect, and get the job done from your phone.', zu: 'I-Spani Plug yenza ukuthola, ukuqasha, nokukhokha abasebenzi abanobuchule kube lula. Ayikho imizamo emide noma uhambo — sesha nje, xhuma, futhi wenze umsebenzi usuka efonini lakho.', xh: 'I-Spani Plug yenza ukufumana, ukuqesha, nokuhlawula abasebenzi abanezakhono kube lula. Akukho minxeba mide okanye ukuhamba — khangela nje, qhagamshelana, kwaye yenza umsebenzi usuka kwifowuni yakho.', af: 'Spani Plug maak die vind, aanstel en betaal van geskoolde werkers moeiteloos. Geen lang oproepe of reis nie — soek net, koppel en kry die werk gedoen vanaf jou foon.' },
  easySearch: { en: 'Easy Search', zu: 'Ukusesha Okulula', xh: 'Ukukhangela Okulula', af: 'Maklike Soektog' },
  easySearchDesc: { en: 'Find skilled workers by location and service type with autocomplete search', zu: 'Thola abasebenzi abanobuchule ngendawo nohlobo lwesevisi ngokusesha okuzenzakalela', xh: 'Fumana abasebenzi abanezakhono ngendawo kunye nohlobo lwenkonzo ngokukhangela okuzenzakalelayo', af: 'Vind geskoolde werkers volgens ligging en dienstipe met outomatiese voltooiing soektog' },
  socialReviews: { en: 'Social Reviews', zu: 'Ukubuyekeza Komphakathi', xh: 'Uphononongo Loluntu', af: 'Sosiale Resensies' },
  socialReviewsDesc: { en: 'See before/after photos, like reviews, and join the community conversation', zu: 'Bona izithombe zangaphambi/ngemuva, njengokubuyekeza, futhi ujoyine ingxoxo yomphakathi', xh: 'Bona iifoto zangaphambi/emva, njengophononongo, kwaye ujoyine incoko yoluntu', af: 'Sien voor/na fotos, hou van resensies en sluit aan by die gemeenskapsgesprek' },
  
  // CTA Section
  readyToStart: { en: 'Ready to Get Started?', zu: 'Ulungele Ukuqala?', xh: 'Ulungele Ukuqala?', af: 'Gereed om te Begin?' },
  readyToStartDesc: { en: 'Join thousands of South Africans connecting with trusted service providers in their community', zu: 'Joyina izinkulungwane zabantu baseNingizimu Afrika abaxhumana nabanikezi bezinsizakalo abathembekile emphakathini wabo', xh: 'Joyina amawaka abantu baseMzantsi Afrika abaqhagamshelana nabanikezi beenkonzo abathembekileyo eluntwini lwabo', af: 'Sluit aan by duisende Suid-Afrikaners wat koppel met betroubare diensverskaffers in hul gemeenskap' },
  exploreServices: { en: 'Explore Services', zu: 'Hlola Izinsizakalo', xh: 'Hlola Iinkonzo', af: 'Verken Dienste' },
  
  // Login Page
  welcomeTo: { en: 'Welcome to Spani Plug', zu: 'Siyakwamukela ku-Spani Plug', xh: 'Wamkelekile kwi-Spani Plug', af: 'Welkom by Spani Plug' },
  loginToConnect: { en: 'Login to connect with service providers', zu: 'Ngena ukuze uxhumane nabanikezi bezinsizakalo', xh: 'Ngena ukuze uqhagamshelane nabanikezi beenkonzo', af: 'Meld aan om te koppel met diensverskaffers' },
  email: { en: 'Email', zu: 'I-imeyili', xh: 'I-imeyile', af: 'E-pos' },
  password: { en: 'Password', zu: 'Iphasiwedi', xh: 'Igama lokugqitha', af: 'Wagwoord' },
  loggingIn: { en: 'Logging in...', zu: 'Iyangena...', xh: 'Iyangena...', af: 'Meld aan...' },
  dontHaveAccount: { en: "Don't have an account?", zu: 'Awunayo i-akhawunti?', xh: 'Awunayo iakhawunti?', af: 'Het jy nie \'n rekening nie?' },
  
  // Signup Page
  createAccount: { en: 'Create Account', zu: 'Dala I-akhawunti', xh: 'Dala Iakhawunti', af: 'Skep Rekening' },
  joinMarketplace: { en: 'Join our marketplace', zu: 'Joyina imakethe yethu', xh: 'Joyina intlolelo yethu', af: 'Sluit aan by ons markplek' },
  fullName: { en: 'Full Name', zu: 'Igama Eliphelele', xh: 'Igama Elipheleleyo', af: 'Volledige Naam' },
  phone: { en: 'Phone', zu: 'Ifoni', xh: 'Ifowuni', af: 'Telefoon' },
  phoneOptional: { en: 'Phone (optional)', zu: 'Ifoni (ongakhetha ukuyifaka)', xh: 'Ifowuni (ongakhetha ukuyifaka)', af: 'Telefoon (opsioneel)' },
  selectRole: { en: 'Select your role', zu: 'Khetha indima yakho', xh: 'Khetha indima yakho', af: 'Kies jou rol' },
  customer: { en: 'Customer', zu: 'Ikhasimende', xh: 'Umthengi', af: 'Kliënt' },
  provider: { en: 'Provider', zu: 'Umhlinzeki', xh: 'Umnikezeli', af: 'Verskaffer' },
  creatingAccount: { en: 'Creating account...', zu: 'Idala i-akhawunti...', xh: 'Idala iakhawunti...', af: 'Skep rekening...' },
  alreadyHaveAccount: { en: 'Already have an account?', zu: 'Usunayo i-akhawunti?', xh: 'Usunayo iakhawunti?', af: 'Het jy reeds \'n rekening?' },
  
  // Discovery Page
  noProvidersFound: { en: 'No service providers found. Try adjusting your filters.', zu: 'Abakho abanikezi bezinsizakalo abatholakele. Zama ukulungisa izihlungi zakho.', xh: 'Akukho banikezi beenkonzo bafumanekileyo. Zama ukulungisa izihluzi zakho.', af: 'Geen diensverskaffers gevind nie. Probeer om jou filters aan te pas.' },
  
  // Common
  back: { en: 'Back', zu: 'Emuva', xh: 'Emva', af: 'Terug' },
  searchSkill: { en: 'Search by skill...', zu: 'Sesha ngekhono...', xh: 'Khangela ngesakhono...', af: 'Soek volgens vaardigheid...' },
  searchLocation: { en: 'Search by location...', zu: 'Sesha ngendawo...', xh: 'Khangela ngendawo...', af: 'Soek volgens ligging...' },
  allSkills: { en: 'All Skills', zu: 'Wonke Amakhono', xh: 'Zonke Izakhono', af: 'Alle Vaardighede' },
  
  // Provider Cards
  perHour: { en: '/hour', zu: '/ihora', xh: '/iyure', af: '/uur' },
  away: { en: 'away', zu: 'kude', xh: 'kude', af: 'weg' },
  reviews: { en: 'reviews', zu: 'ukubuyekezwa', xh: 'uphononongo', af: 'resensies' },
  viewProfile: { en: 'View Profile', zu: 'Buka Iphrofayela', xh: 'Jonga Iprofayile', af: 'Bekyk Profiel' },
  
  // Profile Pages
  about: { en: 'About', zu: 'Mayelana', xh: 'Malunga', af: 'Oor' },
  skills: { en: 'Skills', zu: 'Amakhono', xh: 'Izakhono', af: 'Vaardighede' },
  location: { en: 'Location', zu: 'Indawo', xh: 'Indawo', af: 'Ligging' },
  rate: { en: 'Rate', zu: 'Izinga', xh: 'Ixabiso', af: 'Tarief' },
  customerReviews: { en: 'Customer Reviews', zu: 'Ukubuyekezwa Kwamakhasimende', xh: 'Uphononongo Lwabathengi', af: 'Klante Resensies' },
  contactProvider: { en: 'Contact Provider', zu: 'Xhumana Nomhlinzeki', xh: 'Qhagamshelana Nomnikezeli', af: 'Kontak Verskaffer' },
  customerProfile: { en: 'Customer Profile', zu: 'Iphrofayela Yekhasimende', xh: 'Iprofayile Yomthengi', af: 'Kliënt Profiel' },
  contactDetails: { en: 'Contact Details', zu: 'Imininingwane Yokuxhumana', xh: 'Iinkcukacha Zoqhagamshelwano', af: 'Kontak Besonderhede' },
  memberSince: { en: 'Member Since', zu: 'Ilungu Kusukela', xh: 'Ilungu Ukusukela', af: 'Lid Sedert' },
  editProfile: { en: 'Edit Profile', zu: 'Hlela Iphrofayela', xh: 'Hlela Iprofayile', af: 'Redigeer Profiel' },
  
  // Skills (kept for reference but won't translate dynamic skill values)
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