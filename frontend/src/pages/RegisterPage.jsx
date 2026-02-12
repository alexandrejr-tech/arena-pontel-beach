import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MdCheck } from 'react-icons/md';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/auth/RegisterForm';
import logo from '../assets/logo-arena-pontel-beach.png';
import heroBg from '../assets/hero-pontel.jpg';

const benefits = ['Agende horários online', 'Gerencie seu plano', 'Acesse promoções exclusivas', 'Acompanhe seu histórico'];

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <>
      <Helmet><title>Cadastro | Arena Pontel Beach</title></Helmet>
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
          <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative text-white max-w-md">
            <img src={logo} alt="Arena Pontel Beach" className="h-16 w-auto mb-6" />
            <p className="text-white/70 text-lg mb-8">Por que se cadastrar?</p>
            <ul className="space-y-4">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"><MdCheck /></div>
                  <span className="text-white/90">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <h2 className="text-3xl font-heading font-bold mb-2">Cadastre-se</h2>
            <p className="text-gray-600 mb-8">Crie sua conta gratuitamente</p>
            <RegisterForm />
          </motion.div>
        </div>
      </div>
    </>
  );
}
