import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MdEmojiEvents, MdPeople, MdStar } from 'react-icons/md';
import PublicLayout from '../components/layout/PublicLayout';

const values = [
  { icon: MdStar, title: 'Qualidade', desc: 'Quadras e equipamentos de alto padrão para a melhor experiência.' },
  { icon: MdPeople, title: 'Comunidade', desc: 'Um ambiente acolhedor onde todos são bem-vindos.' },
  { icon: MdEmojiEvents, title: 'Excelência', desc: 'Comprometidos em oferecer o melhor em tudo que fazemos.' },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      <Helmet><title>Quem Somos | Arena Pontel Beach</title></Helmet>
      <div className="bg-gradient-to-r from-dark to-primary/80 py-20 text-center text-white">
        <h1 className="text-4xl font-heading font-bold">Quem Somos</h1>
        <p className="text-white/70 mt-2">Conheça a Arena Pontel Beach</p>
      </div>

      <section className="py-16">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-6">Nossa <span className="text-primary">História</span></h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A Arena Pontel Beach nasceu do sonho de criar um espaço completo para os amantes de esportes de areia em Campinas. Com uma estrutura moderna e quadras de padrão profissional, nos tornamos referência na região.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Nosso compromisso é proporcionar a melhor experiência esportiva, unindo qualidade, conforto e um ambiente que inspira superação e diversão.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="section-container">
          <h2 className="section-title mb-12">Nossos <span className="text-primary">Valores</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className="bg-white rounded-xl p-8 text-center shadow-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <v.icon className="text-primary text-3xl" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">{v.title}</h3>
                <p className="text-gray-600">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
