import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import LanguageSelector from "../components/LanguageSelector";
import VoiceRecorder from "../components/VoiceRecorder";
import QRCodeScanner from "../components/QRCodeScanner";
import NotificationCenter from "../components/NotificationCenter";
import { useGlobalSettings } from "../hooks/useGlobalSettings";
import {
  Globe,
  Mic,
  Camera,
  Bell,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Sparkles,
  Zap,
  Heart,
  Star,
} from "lucide-react";

const GlobalDashboard = () => {
  const { settings, updateSettings } = useGlobalSettings();
  const [activeUsers] = useState(1247);
  const [totalMessages] = useState(89543);
  const [qrScannedData, setQrScannedData] = useState<string | null>(null);

  const handleVoiceRecording = (audioBlob: Blob, duration: number) => {
    console.log("Voice recorded:", { duration, size: audioBlob.size });
    // Process voice recording here
  };

  const handleQRScan = (data: string) => {
    setQrScannedData(data);
    console.log("QR Scanned:", data);
  };

  const features = [
    {
      icon: Globe,
      title: "Multi-language Support",
      description: "50+ dil dəstəyi",
      status: "active",
      color: "bg-blue-500",
    },
    {
      icon: Mic,
      title: "Voice Commands",
      description: "Səsli əmrlər və transkripsiya",
      status: "active",
      color: "bg-green-500",
    },
    {
      icon: Camera,
      title: "QR & Barcode Scanner",
      description: "Real-time skaner sistemi",
      status: "active",
      color: "bg-purple-500",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Ağıllı bildiriş sistemi",
      status: "active",
      color: "bg-orange-500",
    },
    {
      icon: MessageSquare,
      title: "Real-time Chat",
      description: "Canlı mesajlaşma",
      status: "coming-soon",
      color: "bg-pink-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Təkmil analitika",
      status: "coming-soon",
      color: "bg-indigo-500",
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Global Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Dünya səviyyəsində innovativ məhsul idarəetmə sistemi
              </p>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector
                value={settings.language}
                onChange={(lang) => updateSettings({ language: lang })}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Aktiv İstifadəçilər
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {activeUsers.toLocaleString()}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ümumi Mesajlar
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {totalMessages.toLocaleString()}
                    </p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ölkələr</p>
                    <p className="text-2xl font-bold text-purple-600">195+</p>
                  </div>
                  <Globe className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Dillər</p>
                    <p className="text-2xl font-bold text-orange-600">50+</p>
                  </div>
                  <Sparkles className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="features" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="features">Funksiyalar</TabsTrigger>
            <TabsTrigger value="tools">Alətlər</TabsTrigger>
            <TabsTrigger value="notifications">Bildirişlər</TabsTrigger>
            <TabsTrigger value="settings">Parametrlər</TabsTrigger>
          </TabsList>

          <TabsContent value="features">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${feature.color}`}>
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg">{feature.title}</h3>
                        <Badge
                          variant={
                            feature.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="mt-1"
                        >
                          {feature.status === "active" ? "Aktiv" : "Tezliklə"}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="w-5 h-5" />
                      Səs Yazıcı
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VoiceRecorder onRecordingComplete={handleVoiceRecording} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      QR Kod Skaneri
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QRCodeScanner onScanResult={handleQRScan} />
                    {qrScannedData && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-800">
                          Skaner nəticəsi:
                        </p>
                        <p className="text-sm text-green-600 break-all">
                          {qrScannedData}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Qlobal Alətlər</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Zap className="w-4 h-4 mr-2" />
                      API İnteqrasiya
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Heart className="w-4 h-4 mr-2" />
                      Sosial Media
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Star className="w-4 h-4 mr-2" />
                      Premium Funksiyalar
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analitika
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tezliklə Gələcək</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      • Video zəng sistemi
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • Blockchain inteqrasiya
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • AI Vision analiz
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • IoT cihaz dəstəyi
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="max-w-md mx-auto">
              <NotificationCenter />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Qlobal Parametrlər
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Görünüş</h3>
                    <div className="space-y-2">
                      <label className="text-sm">Mövzu</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={settings.theme}
                        onChange={(e) =>
                          updateSettings({ theme: e.target.value as any })
                        }
                      >
                        <option value="light">Açıq</option>
                        <option value="dark">Tünd</option>
                        <option value="auto">Avtomatik</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Bildirişlər</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.notifications}
                          onChange={(e) =>
                            updateSettings({ notifications: e.target.checked })
                          }
                        />
                        <span className="text-sm">
                          Bildirişləri aktivləşdir
                        </span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.sound}
                          onChange={(e) =>
                            updateSettings({ sound: e.target.checked })
                          }
                        />
                        <span className="text-sm">Səs effektləri</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">
                    Məlumat Sinxronizasiyası
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={(e) =>
                          updateSettings({ autoSave: e.target.checked })
                        }
                      />
                      <span className="text-sm">Avtomatik saxlama</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.syncData}
                        onChange={(e) =>
                          updateSettings({ syncData: e.target.checked })
                        }
                      />
                      <span className="text-sm">Bulud sinxronizasiyası</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default GlobalDashboard;
