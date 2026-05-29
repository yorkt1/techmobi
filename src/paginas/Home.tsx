import React from "react";
import Header from "@/componentes/layout/Header";
import Footer from "@/componentes/layout/Footer";
import HeroSection from "@/componentes/home/HeroSection";
import RecentProperties from "@/componentes/home/RecentProperties";
import BrokerSection from "@/componentes/home/BrokerSection";
import DifferentialsSection from "@/componentes/home/DifferentialsSection";
import ServicesSection from "@/componentes/home/ServicesSection";
import PartnersSection from "@/componentes/home/PartnersSection";
import NewsletterSection from "@/componentes/home/NewsletterSection";
import { useSEO } from "@/lib/useSEO";

export default function Home() {
  useSEO({
    title: "Wagner Kaizer Consultoria Imobiliária",
    description: "Consultoria imobiliária especializada no Norte da Ilha de Florianópolis. Compra, venda e aluguel com Wagner Kaizer — CRECI 71853F.",
  });
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <RecentProperties />
      <BrokerSection />
      <DifferentialsSection />
      <ServicesSection />
      <PartnersSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
