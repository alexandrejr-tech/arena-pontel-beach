import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import { MdDashboard, MdPeople, MdCalendarToday, MdCardMembership, MdLogout, MdClose, MdAdminPanelSettings } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: MdDashboard },
  { path: '/admin/alunos', label: 'Alunos', icon: MdPeople },
  { path: '/admin/agendamentos', label: 'Agendamentos', icon: MdCalendarToday },
  { path: '/admin/planos', label: 'Planos', icon: MdCardMembership },
];

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-dark-light text-white w-64">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-lg font-heading font-bold text-primary">Arena Pontel</h2>
        <span className="inline-flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded mt-2">
          <MdAdminPanelSettings /> Admin
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {adminLinks.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-white/10'}`}>
            <Icon className="text-xl" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-400 hover:bg-white/10 w-full transition-colors">
          <MdLogout className="text-xl" /> Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden lg:block fixed left-0 top-0 h-full z-30">{sidebarContent}</div>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'tween' }} className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2 text-gray-300"><MdClose /></button>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="lg:ml-64">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"><HiMenu className="text-xl" /></button>
            <h1 className="text-xl font-heading font-bold text-gray-800">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.name}</span>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
