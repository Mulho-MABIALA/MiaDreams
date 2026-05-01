import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function NewsletterPopup() {
    const [visible, setVisible] = useState(false);
    const { data, setData, post, processing, wasSuccessful, reset } = useForm({ email: '' });

    useEffect(() => {
        if (sessionStorage.getItem('mia_popup_dismissed')) return;

        // Afficher après 30 secondes
        const timer = setTimeout(() => setVisible(true), 30000);

        // Exit intent : souris qui quitte le haut de la page
        const onLeave = (e) => {
            if (e.clientY < 5 && !sessionStorage.getItem('mia_popup_dismissed')) {
                clearTimeout(timer);
                setVisible(true);
            }
        };
        document.addEventListener('mouseleave', onLeave);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    useEffect(() => {
        if (wasSuccessful) {
            setTimeout(dismiss, 3000);
        }
    }, [wasSuccessful]);

    const dismiss = () => {
        setVisible(false);
        sessionStorage.setItem('mia_popup_dismissed', '1');
    };

    const submit = (e) => {
        e.preventDefault();
        post('/newsletter/subscribe', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4"
             style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)' }}
             onClick={(e) => e.target === e.currentTarget && dismiss()}>

            <div className="relative bg-[#0d0d0d] border border-gold/20 max-w-md w-full overflow-hidden"
                 style={{ animation: 'fadeUp .45s forwards' }}>

                {/* Bande décorative dorée en haut */}
                <div className="h-[3px] bg-gold w-full" />

                <div className="p-8 lg:p-10">
                    {/* Fermer */}
                    <button onClick={dismiss}
                            className="absolute top-5 right-5 text-white/25 hover:text-gold transition-colors text-xl leading-none font-glacial">
                        ✕
                    </button>

                    <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">
                        Accès exclusif
                    </span>
                    <h2 className="font-glacial font-light text-white uppercase tracking-[3px] leading-tight mb-3"
                        style={{ fontSize: 'clamp(1.3rem,2.5vw,1.8rem)' }}>
                        REJOIGNEZ LA <span className="text-gold">COMMUNAUTÉ</span>
                    </h2>
                    <div className="w-8 h-px bg-gold my-4" />
                    <p className="font-glacial text-sm text-white/45 leading-relaxed mb-6">
                        Recevez en exclusivité nos nouvelles collections, conseils style et invitations à nos événements.
                    </p>

                    {wasSuccessful ? (
                        <div className="py-6 text-center">
                            <div className="w-12 h-12 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                            <p className="font-glacial text-sm text-gold tracking-[3px] uppercase">Bienvenue dans la communauté !</p>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="flex flex-col gap-3">
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="Votre adresse email"
                                required
                                className="w-full bg-white/[0.04] border border-white/10 text-white font-glacial text-sm px-4 py-3 outline-none focus:border-gold/40 placeholder:text-white/20 transition-colors"
                            />
                            <button type="submit" disabled={processing}
                                    className="w-full bg-gold text-[#0d0d0d] font-glacial text-[11px] tracking-[4px] uppercase py-3.5 hover:bg-[#d4b97a] transition-colors duration-300 disabled:opacity-50">
                                {processing ? 'INSCRIPTION…' : "S'INSCRIRE →"}
                            </button>
                        </form>
                    )}

                    <p className="font-glacial text-[10px] text-white/15 text-center mt-5 tracking-[1px]">
                        Pas de spam · Désabonnement libre à tout moment
                    </p>
                </div>
            </div>
        </div>
    );
}
