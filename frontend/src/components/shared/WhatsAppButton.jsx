import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { SOCIAL_LINKS } from '../../utils/constants';

export default function WhatsAppButton() {
  return (
    <motion.a
      href={SOCIAL_LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{ boxShadow: ['0 0 0 0 rgba(34,197,94,0.4)', '0 0 0 20px rgba(34,197,94,0)', '0 0 0 0 rgba(34,197,94,0)'] }}
      transition={{ duration: 2, repeat: Infinity }}
      aria-label="Contato via WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
    </motion.a>
  );
}
