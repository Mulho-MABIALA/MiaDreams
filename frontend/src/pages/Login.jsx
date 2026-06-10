import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm]             = useState({ email: '', password: '' });
    const [error, setError]           = useState('');
    const [loading, setLoading]       = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setForm({ email: '', password: '' });
        setError('');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const MAX_RETRIES = 8;
        const RETRY_DELAY = 7000;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const res = await axios.post('/api/auth/login', form);
                localStorage.setItem('admin_token', res.data.token);
                localStorage.setItem('admin_user', JSON.stringify(res.data.user));
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                navigate('/admin');
                return;
            } catch (err) {
                const status = err.response?.status;
                if (status === 401) {
                    setError(err.response.data.message || 'Identifiants incorrects');
                    break;
                }
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
        <div style={{
            minHeight: '100vh',
            background: '#080808',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Fond image avec overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: "url('/img/index/home-image6.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.18)',
            }} />

            {/* Lueurs dorées décoratives */}
            <div style={{
                position: 'absolute',
                top: '15%', left: '10%',
                width: '400px', height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%', right: '8%',
                width: '350px', height: '350px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Carte glassmorphisme */}
            <div style={{
                position: 'relative', zIndex: 10,
                width: '100%', maxWidth: '420px',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <img
                        src="/img/logo_MIA.png"
                        alt="MIA DREAMS"
                        style={{ height: '52px', margin: '0 auto 16px', filter: 'brightness(0) invert(1)', opacity: 0.92 }}
                    />
                    <p style={{
                        fontFamily: 'Lastica, sans-serif',
                        fontSize: '9px',
                        letterSpacing: '6px',
                        color: 'rgba(201,168,76,0.85)',
                        textTransform: 'uppercase',
                    }}>
                        Espace Administration
                    </p>
                </div>

                {/* Carte verre */}
                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    borderRadius: '2px',
                    padding: '40px 36px',
                    boxShadow: '0 8px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}>
                    {/* Séparateur titre */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.2)' }} />
                        <span style={{
                            fontFamily: 'Lastica, sans-serif',
                            fontSize: '9px',
                            letterSpacing: '4px',
                            color: 'rgba(255,255,255,0.6)',
                            textTransform: 'uppercase',
                        }}>Connexion</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.2)' }} />
                    </div>

                    <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Email */}
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                required
                                autoComplete="off"
                                autoFocus
                                placeholder="Votre adresse email"
                                style={inputStyle}
                                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                                onBlur={e => Object.assign(e.target.style, inputStyle)}
                            />
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label style={labelStyle}>Mot de passe</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    required
                                    autoComplete="new-password"
                                    placeholder="Votre mot de passe"
                                    style={{ ...inputStyle, paddingRight: '44px' }}
                                    onFocus={e => Object.assign(e.target.style, { ...inputFocusStyle, paddingRight: '44px' })}
                                    onBlur={e => Object.assign(e.target.style, { ...inputStyle, paddingRight: '44px' })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    tabIndex={-1}
                                    style={{
                                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'rgba(255,255,255,0.4)', padding: '4px',
                                    }}>
                                    {showPassword ? (
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Erreur */}
                        {error && (
                            <div style={{
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.25)',
                                borderRadius: '2px',
                                padding: '10px 14px',
                                fontFamily: 'Glacial Indifference, sans-serif',
                                fontSize: '12px',
                                color: '#f87171',
                                textAlign: 'center',
                                letterSpacing: '0.5px',
                            }}>{error}</div>
                        )}

                        {/* Bouton */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: loading ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.9)',
                                border: '1px solid rgba(201,168,76,0.4)',
                                color: '#080808',
                                fontFamily: 'Lastica, sans-serif',
                                fontSize: '9px',
                                letterSpacing: '3px',
                                textTransform: 'uppercase',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                marginTop: '4px',
                                backdropFilter: 'blur(4px)',
                            }}>
                            {loading ? 'CONNEXION…' : 'SE CONNECTER'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p style={{
                    textAlign: 'center',
                    fontFamily: 'Glacial Indifference, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.3)',
                    marginTop: '24px',
                    letterSpacing: '1px',
                }}>
                    MIA DREAMS & CO — Administration
                </p>
            </div>
        </div>
    );
}

const labelStyle = {
    display: 'block',
    fontFamily: 'Lastica, sans-serif',
    fontSize: '9px',
    letterSpacing: '3px',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    marginBottom: '8px',
};

const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    fontFamily: 'Glacial Indifference, sans-serif',
    fontSize: '14px',
    padding: '12px 16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    borderRadius: '1px',
};

const inputFocusStyle = {
    ...inputStyle,
    border: '1px solid rgba(201,168,76,0.6)',
    background: 'rgba(255,255,255,0.07)',
};
