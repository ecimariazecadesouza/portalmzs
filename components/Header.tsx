import React from 'react';
import { BookOpen, GraduationCap, School, ShieldCheck, FileText } from 'lucide-react';
import { ViewMode } from '../types';

import { logoBase64 } from '../assets/logoBase64';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'students' as ViewMode, label: 'Mural', icon: <GraduationCap size={20} /> },
    { id: 'documents' as ViewMode, label: 'Arquivos', icon: <FileText size={20} /> },
    { id: 'teachers' as ViewMode, label: 'Professores', icon: <BookOpen size={20} /> },
    { id: 'admin' as ViewMode, label: 'Administração', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-school-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-1 rounded-lg ring-1 ring-gray-200/50 shadow-sm overflow-hidden">
                <img src={logoBase64} alt="Logo ECIT" className="h-10 w-10 object-contain" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Portal MZS</h1>
              <p className="text-xs text-gray-500 font-medium hidden sm:block">Conectando Educação</p>
            </div>
          </div>

          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-1 sm:pb-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                  ${currentView === item.id
                    ? 'bg-school-50 text-school-700 ring-1 ring-school-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;