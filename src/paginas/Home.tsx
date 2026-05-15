import React from "react";
import Header from "@/componentes/layout/Header";
import Footer from "@/componentes/layout/Footer";
import HeroSection from "@/componentes/home/HeroSection";
import RecentProperties from "@/componentes/home/RecentProperties";
import BrokerSection from "@/componentes/home/BrokerSection";
import DifferentialsSection from "@/componentes/home/DifferentialsSection";
import CTASection from "@/componentes/home/CTASection";
import PartnersSection from "@/componentes/home/PartnersSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <RecentProperties />
      <BrokerSection />
      <DifferentialsSection />
      <PartnersSection />
      <CTASection />
      <Footer />
    </div>
  );
}
