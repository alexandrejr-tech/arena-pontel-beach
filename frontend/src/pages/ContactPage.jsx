import { Helmet } from 'react-helmet-async';
import PublicLayout from '../components/layout/PublicLayout';
import ContactSection from '../components/home/ContactSection';
import LocationSection from '../components/home/LocationSection';

export default function ContactPage() {
  return (
    <PublicLayout>
      <Helmet><title>Contato | Arena Pontel Beach</title></Helmet>
      <div className="bg-gradient-to-r from-dark to-primary/80 py-20 text-center text-white">
        <h1 className="text-4xl font-heading font-bold">Contato</h1>
        <p className="text-white/70 mt-2">Fale conosco</p>
      </div>
      <ContactSection />
      <LocationSection />
    </PublicLayout>
  );
}
