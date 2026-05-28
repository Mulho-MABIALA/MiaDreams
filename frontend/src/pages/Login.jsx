import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Retry jusqu'à 8 fois (gère le cold start Render ~50s)
        const MAX_RETRIES = 8;
        const RETRY_DELAY = 7000; // 7s entre chaque essai

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const res = await axios.post('/api/auth/login', form);
                localStorage.setItem('admin_token', res.data.token);
                localStorage.setItem('admin_user', JSON.stringify(res.data.user));
                navigate('/admin');
                return;
            } catch (err) {
                const status = err.response?.status;
                // 401 = mauvais identifiants → ne pas retry
                if (status === 401) {
                    setError(err.response.data.message || 'Identifiants incorrects');
                    break;
                }
                // 404/503/network → serveur en démarrage → retry
                if (attempt < MAX_RETRIES) {
                    setError(`Serveur en démarrage… (${attempt}/${MAX_RETRIES})`);
                    await new Promise(r => setTimeout(r, RETRY_DELAY));
                } else {
                    setError('Le serveur est indisponible. Réessayez dans quelques secondes.');
                }
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
            {/* Logo */}
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <img src="/img/logo_MIA.png" alt="MIA DREAMS" className="h-14 mx-auto mb-4" />
                    <p className="font-lastica text-[8px] tracking-[5px] text-gold/50 uppercase">Espace Administration</p>
                </div>

                <div className="border border-gold/10 bg-[#0f0f0f] p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-gold/8" />
                        <span className="font-lastica text-[7px] tracking-[4px] text-gold/40 uppercase">Connexion</span>
                        <div className="flex-1 h-px bg-gold/8" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="font-lastica text-[7px] tracking-[3px] text-white/30 uppercase block mb-2">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                required
                                autoFocus
                                className="w-full bg-[#080808] border border-white/10 text-white font-glacial text-sm px-4 py-3 outline-none focus:border-gold/40 transition-colors placeholder:text-white/15"
                                placeholder="admin@miadreams.com"
                            />
                        </div>

                        <div>
                            <label className="font-lastica text-[7px] tracking-[3px] text-white/30 uppercase block mb-2">Mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    required
                                    className="w-full bg-[#080808] border border-white/10 text-white font-glacial text-sm px-4 py-3 pr-11 outline-none focus:border-gold/40 transition-colors placeholder:text-white/15"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-gold/70 transition-colors duration-200 focus:outline-none"
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                >
                                    {showPassword ? (
                                        /* Œil barré — mot de passe visible */
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                        </svg>
                                    ) : (
                                        /* Œil ouvert — mot de passe masqué */
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="font-glacial text-xs text-red-400/80 tracking-[1px] text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-gold w-full py-3.5 text-[9px] tracking-[3px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'CONNEXION…' : 'SE CONNECTER'}
                        </button>
                    </form>
                </div>

                <p className="text-center font-glacial text-[10px] text-white/15 mt-6 tracking-[1px]">
                    MIA DREAMS & CO — Administration
                </p>
            </div>
        </div>
    );
}
