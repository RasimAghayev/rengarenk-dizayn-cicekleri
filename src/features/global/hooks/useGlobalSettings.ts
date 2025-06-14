import { useState, useEffect } from "react";
import { GlobalSettings } from "../types/global";

export const useGlobalSettings = () => {
  const [settings, setSettings] = useState<GlobalSettings>({
    theme: "light",
    language: "az",
    notifications: true,
    sound: true,
    autoSave: true,
    syncData: true,
  });

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem("globalSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (newSettings: Partial<GlobalSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem("globalSettings", JSON.stringify(updatedSettings));
  };

  return { settings, updateSettings };
};
