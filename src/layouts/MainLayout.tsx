import React from "react";
import CustomHeader from "@/components/CustomHeader";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CustomHeader />

      <main className={cn("flex-1", className)}>{children}</main>

      <Footer />
    </div>
  );
};

export default MainLayout;
