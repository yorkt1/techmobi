import React from "react";
import Header from "@/componentes/layout/Header";
import Footer from "@/componentes/layout/Footer";
import HeroSection from "@/componentes/home/HeroSection";
import RecentProperties from "@/componentes/home/RecentProperties";
import BrokerSection from "@/componentes/home/BrokerSection";
import DifferentialsSection from "@/componentes/home/DifferentialsSection";
import PartnersSection from "@/componentes/home/PartnersSection";
import NewsletterSection from "@/componentes/home/NewsletterSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <RecentProperties />
      <BrokerSection />
      <DifferentialsSection />
      <PartnersSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
