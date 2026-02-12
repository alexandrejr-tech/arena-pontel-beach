import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import logo from '../assets/logo-arena-pontel-beach.png';
import heroBg from '../assets/hero-pontel.jpg';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <>
      <Helmet><title>Login | Arena Pontel Beach</title></Helmet>
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
          <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative text-white text-center max-w-md">
            <img src={logo} alt="Arena Pontel Beach" className="h-20 w-auto mx-auto mb-6" />
            <p className="text-white/70 text-lg">A nova referência em esportes de areia em Campinas</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <h2 className="text-3xl font-heading font-bold mb-2">Bem-vindo de volta</h2>
            <p className="text-gray-600 mb-8">Faça login para acessar sua conta</p>
            <LoginForm />
          </motion.div>
        </div>
      </div>
    </>
  );
}
