import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet><title>Esqueci minha senha | Arena Pontel Beach</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-heading font-bold text-center mb-2">Esqueci minha senha</h2>
          <ForgotPasswordForm />
        </motion.div>
      </div>
    </>
  );
}
