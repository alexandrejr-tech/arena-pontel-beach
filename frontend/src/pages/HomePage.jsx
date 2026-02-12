import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import WhatsAppButton from '../components/shared/WhatsAppButton';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import SportsSection from '../components/home/SportsSection';
import PlansSection from '../components/home/PlansSection';
import GallerySection from '../components/home/GallerySection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import LocationSection from '../components/home/LocationSection';
import ContactSection from '../components/home/ContactSection';
import CTASection from '../components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Arena Pontel Beach | A nova referência em esportes de areia</title>
        <meta name="description" content="Arena de esportes de areia em Campinas. Futevôlei, Beach Tênis e Eventos com estrutura de alto padrão." />
      </Helmet>
      <Header />
      <HeroSection />
      <AboutSection />
      <SportsSection />
      <PlansSection />
      <GallerySection />
      <TestimonialsSection />
      <LocationSection />
      <ContactSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
