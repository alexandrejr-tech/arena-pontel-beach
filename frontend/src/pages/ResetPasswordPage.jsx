import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <>
      <Helmet><title>Redefinir senha | Arena Pontel Beach</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-heading font-bold text-center mb-2">Redefinir senha</h2>
          <ResetPasswordForm />
        </motion.div>
      </div>
    </>
  );
}
