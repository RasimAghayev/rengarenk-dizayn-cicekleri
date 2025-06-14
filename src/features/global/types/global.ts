
// Global types for international features
export interface Language {
  code: string;
  name: string;
  flag: string;
  rtl?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  language: string;
  country: string;
  timezone: string;
  role: 'admin' | 'user' | 'premium';
  isOnline: boolean;
  lastSeen: Date;
}

export interface GlobalSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  sound: boolean;
  autoSave: boolean;
  syncData: boolean;
}

export interface AIMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'voice' | 'image' | 'file';
  language?: string;
  translated?: boolean;
}
