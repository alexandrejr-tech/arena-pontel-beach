import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDashboard, MdCalendarToday, MdCardMembership, MdPerson, MdHistory, MdLogout, MdClose } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo-arena-pontel-beach.png';

const links = [
  { path: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { path: '/meus-agendamentos', label: 'Agendamentos', icon: MdCalendarToday },
  { path: '/meu-plano', label: 'Meu Plano', icon: MdCardMembership },
  { path: '/meu-perfil', label: 'Meu Perfil', icon: MdPerson },
  { path: '/historico', label: 'Histórico', icon: MdHistory },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const content = (
    <div className="h-full flex flex-col bg-white border-r w-64">
      <div className="p-6 border-b">
        <img src={logo} alt="Arena Pontel Beach" className="h-10 w-auto" />
        <p className="text-sm text-gray-500 mt-1">{user?.name}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <Icon className="text-xl" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-50 w-full transition-colors">
          <MdLogout className="text-xl" /> Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-30">{content}</div>

      {/* Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'tween' }} className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"><MdClose className="text-xl" /></button>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
