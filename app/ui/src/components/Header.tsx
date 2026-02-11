import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-white/95 dark:bg-background-dark/95 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 text-primary">
          <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L1 12l11 10 11-10L12 2zm0 15.5L6.5 12H10v-2h4v2h3.5L12 17.5z" transform="matrix(1 0 0 -1 0 24)" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-secondary dark:text-white">Controle Smart Campus</h1>
      </div>
      
      <nav className="hidden items-center gap-6 md:flex">
        <Link to="/" className={`header-nav-link ${isActive('/') ? 'header-nav-link-active' : ''}`}>
          Painel de Controle
        </Link>
        <Link to="/temperatura" className={`header-nav-link ${isActive('/temperatura') ? 'header-nav-link-active' : ''}`}>
          Temperatura
        </Link>
        <Link to="/energia" className={`header-nav-link ${isActive('/energia') ? 'header-nav-link-active' : ''}`}>
          Consumo de Energia
        </Link>
        <Link to="/comandos" className={`header-nav-link ${isActive('/comandos') ? 'header-nav-link-active' : ''}`}>
          Controles
        </Link>
      </nav>
      
      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-secondary dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>
      </div>
    </header>
  );
};

export default Header;