import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';
import logo from '../../assets/logo-arena-pontel-beach.png';

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <img src={logo} alt="Arena Pontel Beach" className="h-32 w-auto mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed mb-4">A nova referência em esportes de areia em Campinas. Qualidade, conforto e lifestyle em um espaço completo.</p>
            <div className="flex gap-3">
              <a href="https://instagram.com/arenapontelbeach" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <FaInstagram />
              </a>
              <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5519999378998'}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/quem-somos" className="hover:text-primary transition-colors">Quem Somos</Link></li>
              <li><Link to="/planos" className="hover:text-primary transition-colors">Planos</Link></li>
              <li><Link to="/agenda" className="hover:text-primary transition-colors">Agenda</Link></li>
              <li><Link to="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Modalidades</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Futevôlei</li>
              <li>Beach Tênis</li>
              <li>Eventos</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2"><MdLocationOn className="text-primary mt-0.5 shrink-0" /> Rua Eleni Manga de Araujo Lalier, Campinas — SP, 13056-542</li>
              <li className="flex items-center gap-2"><MdPhone className="text-primary shrink-0" /> (19) 99999-9999</li>
              <li className="flex items-center gap-2"><MdEmail className="text-primary shrink-0" /> contato@arenapontelbeach.com.br</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="text-center text-sm text-gray-500">&copy; {new Date().getFullYear()} Arena Pontel Beach. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
