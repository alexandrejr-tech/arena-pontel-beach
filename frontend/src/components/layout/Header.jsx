import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { MdPerson, MdDashboard, MdLogout } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import { NAV_LINKS } from '../../utils/constants';
import logo from '../../assets/logo-arena-pontel-beach.png';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const showDark = scrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showDark ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Arena Pontel Beach" className="h-32 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-medium transition-colors ${isActive ? 'text-primary' : showDark ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-primary-light'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className={`flex items-center gap-2 font-medium ${showDark ? 'text-gray-700' : 'text-white'}`}>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  {user?.name?.split(' ')[0]}
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border"
                    >
                      <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                        <MdDashboard /> Dashboard
                      </Link>
                      <Link to="/meu-perfil" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                        <MdPerson /> Meu Perfil
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left text-red-500">
                        <MdLogout /> Sair
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className={`font-medium ${showDark ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-primary-light'}`}>Login</Link>
                <Link to="/cadastro" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors">Cadastre-se</Link>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2 ${showDark ? 'text-gray-700' : 'text-white'}`}>
            {isOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.path} to={link.path} className="block py-2 text-gray-700 font-medium hover:text-primary" onClick={() => setIsOpen(false)}>
                  {link.label}
                </NavLink>
              ))}
              <hr />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block py-2 text-gray-700 font-medium" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} className="block py-2 text-red-500 font-medium">Sair</button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link to="/login" className="flex-1 text-center py-2 border border-primary text-primary rounded-lg font-medium" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/cadastro" className="flex-1 text-center py-2 bg-primary text-white rounded-lg font-medium" onClick={() => setIsOpen(false)}>Cadastre-se</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
