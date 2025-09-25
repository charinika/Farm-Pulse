import { useLanguage } from "@/pages/LanguageContext";
import en from "@/translations/en.json";
import ta from "@/translations/ta.json";

// Add more languages as needed
const translations: Record<string, Record<string, string>> = { en, ta };

export function useTranslatedText(key: string): string {
  const { lang } = useLanguage();
  return translations[lang]?.[key] || translations["en"][key] || key;
}
