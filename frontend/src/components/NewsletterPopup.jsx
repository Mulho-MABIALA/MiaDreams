import { useState, useEffect } from 'react';
import axios from 'axios';

export default function NewsletterPopup() {
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (localStorage.getItem('mia_newsletter_dismissed')) return;
        const timer = setTimeout(() => setVisible(true), 30000);
        const onMouseLeave = (e) => {
            if (e.clientY <= 0 && !localStorage.getItem('mia_newsletter_dismissed')) setVisible(true);
        };
        document.addEventListener('mouseleave', onMouseLeave);
        return () => { clearTimeout(timer); document.removeEventListener('mouseleave', onMouseLeave); };
    }, []);

    const dismiss = () => {
        setVisible(false);
        localStorage.setItem('mia_newsletter_dismissed', '1');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('/api/newsletter', { email });
            setSuccess(true);
            setTimeout(dismiss, 3000);
        } catch (err) {
            setError(err.response?.data?.errors?.email || 'Une erreur est survenue.');
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
             style={{ background: 'rgba(8,8,8,.7)', backdropFilter: 'blur(4px)' }}>
            <div className="w-full max-w-md border border-gold/20 bg-[#0d0d0d] p-8 relative"
                 style={{ animation: 'fadeUp .4s forwards' }}>
                <button onClick={dismiss}
                        className="absolute top-4 right-4 text-white/25 hover:text-gold transition-colors text-xl leading-none">✕</button>

                <p className="font-lastica text-[7px] tracking-[5px] text-gold uppercase mb-3">Rejoignez-nous</p>
                <h3 className="font-glacial text-2xl font-light text-white uppercase tracking-[4px] mb-2">
                    NEWSLETTER<br /><span className="text-gold">MIA DREAMS</span>
                </h3>
                <p className="font-glacial text-xs text-white/35 leading-relaxed mb-7">
                    Actualités, collections, événements — directement dans votre boîte mail.
                </p>

                {success ? (
                    <p className="font-glacial text-sm text-gold tracking-[2px]">✓ Inscription confirmée !</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="flex">
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                   placeholder="VOTRE EMAIL" required
                                   className="flex-1 bg-transparent border border-white/10 border-r-0 text-white
                                              placeholder-white/20 px-4 py-3 font-glacial text-sm tracking-wide
                                              outline-none focus:border-gold/40 transition-colors" />
                            <button type="submit"
                                    className="bg-gold text-[#080808] px-5 py-3 font-glacial text-[9px] tracking-[3px]
                                               uppercase hover:bg-gold-light transition-colors whitespace-nowrap">
                                OK
                            </button>
                        </div>
                        {error && <p className="text-red-400 text-xs mt-2 font-glacial">{error}</p>}
                    </form>
                )}
            </div>
        </div>
    );
}
