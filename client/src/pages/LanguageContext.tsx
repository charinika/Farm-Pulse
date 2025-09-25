import { createContext, useContext, useState, ReactNode } from "react";
import { translateText } from "@/utils/translate";

type LanguageContextType = {
  lang: string;
  setLang: (lang: string) => void;
  translate: (text: string) => Promise<string>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState("en");

  const translate = async (text: string) => {
    if (lang === "en") return text;
    return await translateText(text, lang, "en");
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

