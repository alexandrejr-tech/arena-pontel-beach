import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, padding = 'p-6', ...rest }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } : {}}
      className={`bg-white rounded-xl shadow-md ${padding} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
