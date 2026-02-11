import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Temperatura from './pages/Temperatura';
import Energia from './pages/Energia';
import Comandos from './pages/Comandos';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
        <Header />
        <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/temperatura" element={<Temperatura />} />
            <Route path="/energia" element={<Energia />} />
            <Route path="/comandos" element={<Comandos />} />
          </Routes>
        </main>
        
        <footer className="mt-12 border-t border-border-light dark:border-border-dark py-6 text-center">
          <p className="text-sm text-text-secondary dark:text-gray-400">
            Sistema Smart Campus IFPE • {new Date().getFullYear()}
          </p>
          <p className="text-xs text-text-secondary dark:text-gray-500 mt-1">
            Desenvolvido para monitoramento e controle de salas
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;