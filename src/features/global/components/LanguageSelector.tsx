import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Languages } from "lucide-react";
import { Language } from "../types/global";

const languages: Language[] = [
  { code: "az", name: "Azərbaycan", flag: "🇦🇿" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ar", name: "العربية", flag: "🇸🇦", rtl: true },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
}) => {
  const selectedLanguage = languages.find((lang) => lang.code === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span className="text-lg">{selectedLanguage?.flag}</span>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
