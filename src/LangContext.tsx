import { createContext, useContext } from 'react';
import { translations, type Lang, type T } from './i18n';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: T;
}

export const LangContext = createContext<LangCtx>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
});

export const useLang = () => useContext(LangContext);
