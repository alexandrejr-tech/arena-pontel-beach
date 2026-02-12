import { motion } from 'framer-motion';
import { MdLocationOn, MdAccessTime, MdPhone } from 'react-icons/md';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function LocationSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="section-title"><span className="text-primary">Localização</span></h2>
          <p className="section-subtitle">Venha nos visitar</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isVisible ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }}
            className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <MdLocationOn className="text-primary text-2xl" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg mb-1">Endereço</h3>
                <p className="text-gray-600">Rua Eleni Manga de Araujo Lalier</p>
                <p className="text-gray-600">Campinas — SP, CEP 13056-542</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <MdAccessTime className="text-primary text-2xl" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg mb-1">Horário de Funcionamento</h3>
                <p className="text-gray-600">Seg-Sex: 6h às 22h</p>
                <p className="text-gray-600">Sáb: 7h às 20h</p>
                <p className="text-gray-600">Dom: 7h às 18h</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <MdPhone className="text-primary text-2xl" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg mb-1">Telefone</h3>
                <p className="text-gray-600">(19) 99999-9999</p>
              </div>
            </div>

            <a href="https://www.google.com/maps/search/Rua+Eleni+Manga+de+Araujo+Lalier+Campinas+SP" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors mt-4">
              Como chegar
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={isVisible ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }}
            className="rounded-xl overflow-hidden shadow-lg h-80 lg:h-auto">
            <iframe
              title="Localização Arena Pontel Beach"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.0!2d-47.0626!3d-22.9099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDU0JzM1LjYiUyA0N8KwMDMnNDUuNCJX!5e0!3m2!1spt-BR!2sbr!4v1"
              width="100%" height="100%" style={{ border: 0, minHeight: '300px' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
