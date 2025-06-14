import React from "react";
import Logo from "@/components/Logo";
import ColorBlock from "@/components/ColorBlock";
import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/MainLayout";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Bot, Sparkles, MessageSquare, Globe, Mic, Camera } from "lucide-react";
import Card from "@/components/ui/card";
import CardContent from "@/components/ui/card-content";

const Index = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="animate-float mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-brandBlue to-brandGreen rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-brandBlue via-brandGreen to-purple-600 bg-clip-text text-transparent">
            Gələcəyin Texnologiyası
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Dünya səviyyəsinde AI, səsli əmrlər, QR skaneri və çoxdilli dəstək
            ilə innovativ məhsul
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-brandBlue to-brandGreen hover:from-brandBlue/90 hover:to-brandGreen/90 px-8 py-4 text-lg"
            >
              <Link to="/global">
                <Globe className="w-5 h-5 mr-2" />
                Global Dashboard
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg"
            >
              <Link to="/ai">
                <Bot className="w-5 h-5 mr-2" />
                AI Köməkçi
              </Link>
            </Button>
          </div>

          {/* Global Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">50+ Dil</h3>
                <p className="text-sm text-gray-600">
                  Qlobal auditoriya üçün çoxdilli dəstək
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <Mic className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Səsli Əmrlər</h3>
                <p className="text-sm text-gray-600">
                  Səslə idarəetmə və transkripsiya
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <Camera className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">QR Skaneri</h3>
                <p className="text-sm text-gray-600">
                  Real-time QR və barkod oxuyucu
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <Bot className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">AI Köməkçi</h3>
                <p className="text-sm text-gray-600">
                  Ağıllı köməkçi və analiz
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-brandBlue mb-2">195+</div>
              <div className="text-sm text-gray-600">Ölkə</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brandGreen mb-2">1M+</div>
              <div className="text-sm text-gray-600">İstifadəçi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">Dil</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                24/7
              </div>
              <div className="text-sm text-gray-600">Dəstək</div>
            </div>
          </div>
        </section>

        {/* Navigation Cards */}
        <section className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Navigation Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center">
                <Logo className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mt-4">Home</h3>
              <p className="text-sm text-muted-foreground">
                Explore our products and services.
              </p>
            </div>

            {/* Navigation Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-brandBlue" />
              </div>
              <h3 className="text-xl font-bold mt-4">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Get in touch with us for any inquiries.
              </p>
            </div>

            {/* Navigation Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center">
                <Bot className="w-12 h-12 text-brandRed" />
              </div>
              <h3 className="text-xl font-bold mt-4">About</h3>
              <p className="text-sm text-muted-foreground">
                Learn more about our company and values.
              </p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
