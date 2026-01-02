import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Ticket, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <span className="text-4xl font-extrabold text-primary dark:text-white tracking-tight">Fila</span>
                        <div className="bg-primary text-secondary rounded-xl p-2 transform -rotate-12 shadow-md">
                            <Ticket size={28} fill="currentColor" className="text-secondary" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-charcoal dark:text-white tracking-tight">¡Hola de nuevo!</h2>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mt-2 font-medium">Ingresá para gestionar tus pedidos.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none font-medium"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none font-medium"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] group disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Entrar <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-slate-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
                        ¿Sos nuevo? <Link to="/register" className="text-primary dark:text-secondary hover:underline ml-1">Registrate gratis</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
