import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                required
                                className="w-full bg-[#080808] border border-white/10 text-white font-glacial text-sm px-4 py-3 outline-none focus:border-gold/40 transition-colors placeholder:text-white/15"
                                placeholder="••••••••"
                            />
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
