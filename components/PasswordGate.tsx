import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, KeyRound } from 'lucide-react';

interface PasswordGateProps {
    correctPassword: string;
    title: string;
    storageKey: string;
    children: React.ReactNode;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ correctPassword, title, storageKey, children }) => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const savedAuth = sessionStorage.getItem(storageKey);
        if (savedAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, [storageKey]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === correctPassword) {
            setIsAuthenticated(true);
            setError(false);
            sessionStorage.setItem(storageKey, 'true');
        } else {
            setError(true);
            setPassword('');
            setTimeout(() => setError(false), 3000);
        }
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full text-center">
                <div className="bg-school-50 text-school-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
                <p className="text-gray-500 mb-8 italic">
                    Esta área é reservada para a {title}. Por favor, insira a senha para continuar.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <KeyRound size={18} />
                        </span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite a senha..."
                            className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all ${error
                                    ? 'border-red-300 focus:ring-red-200 bg-red-50 text-red-900'
                                    : 'border-gray-200 focus:border-school-500 focus:ring-school-200 bg-white'
                                }`}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center justify-center gap-2 text-red-600 text-sm font-medium animate-in shake duration-300">
                            <ShieldAlert size={14} />
                            Senha incorreta. Tente novamente.
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-school-600 hover:bg-school-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-school-200 transition-all active:scale-95"
                    >
                        Acessar Página
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordGate;
