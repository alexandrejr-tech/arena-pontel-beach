import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../shared/WhatsAppButton';

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
