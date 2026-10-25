import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';

const GOLD = '#C9A84C';
const MAX_AUTO_RETRIES = 6;      // mobile money : la validation sur le téléphone peut prendre un moment
const RETRY_DELAY_MS   = 5000;

/**
 * Page de retour CinetPay (success_url / failed_url) : /paiement/retour?ref=…[&echec=1]
 * Revérifie le paiement côté serveur (POST /api/payment/cinetpay/verify), puis :
 *   - commande boutique  → vide le panier et redirige vers /commande/succes/:id
 *   - inscription formation → affiche la confirmation (reçu envoyé par email)
 */
export default function PaiementRetour() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const reference = searchParams.get('ref') || '';

    const [state, setState] = useState(reference ? 'checking' : 'error'); // checking | pending | success | error
    const [info, setInfo] = useState({ message: reference ? '' : 'Référence de paiement manquante.' });
    const retries = useRef(0);
    const timer = useRef(null);
    const mounted = useRef(true);
    useEffect(() => () => { mounted.current = false; clearTimeout(timer.current); }, []);

    const verify = useCallback(async () => {
        if (!reference) return;
        setState(s => (s === 'pending' ? 'pending' : 'checking'));
        try {
            const res = await axios.post('/api/payment/cinetpay/verify', { reference }, {
                validateStatus: (st) => st === 200 || st === 202,
            });
            if (!mounted.current) return;
            const data = res.data || {};

            if (res.status === 202) {
                setState('pending');
                setInfo(data);
                if (retries.current < MAX_AUTO_RETRIES) {
                    retries.current += 1;
                    timer.current = setTimeout(verify, RETRY_DELAY_MS);
                }
                return;
            }

            if (data.type === 'order' && data.id) {
                clearCart();
                navigate(`/commande/succes/${data.id}`, { replace: true });
                return;
            }
            setState('success');
            setInfo(data);
        } catch (err) {
            if (!mounted.current) return;
            setState('error');
            setInfo(err.response?.data || { message: 'Impossible de vérifier le paiement pour le moment.' });
        }
    }, [reference, clearCart, navigate]);

    useEffect(() => { verify(); }, [verify]);

    return (
        <Layout title="Paiement — MIA DREAMS">
            <div className="bg-[#080808] min-h-screen flex items-center justify-center px-6 pt-24 pb-20">
                <div className="max-w-md w-full text-center border border-gold/15 p-10">

                    {(state === 'checking' || state === 'pending') && (
                        <>
                            <svg className="animate-spin w-8 h-8 mx-auto mb-6" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2">
                                <circle cx="12" cy="12" r="10" strokeOpacity=".2" />
                                <path d="M12 2a10 10 0 0110 10" />
                            </svg>
                            <h1 className="font-glacial text-lg text-white uppercase tracking-[2px] mb-3">
                                {state === 'checking' ? 'Vérification du paiement…' : 'Paiement en cours de confirmation'}
                            </h1>
                            {state === 'pending' && (
                                <>
                                    <p className="font-glacial text-sm text-white/55 leading-relaxed mb-6">
                                        {info.message || 'Si vous avez validé le paiement sur votre téléphone, la confirmation arrive dans un instant.'}
                                    </p>
                                    <button onClick={() => { retries.current = 0; clearTimeout(timer.current); verify(); }} className="btn btn-gold">
                                        Vérifier à nouveau
                                    </button>
                                </>
                            )}
                        </>
                    )}

                    {state === 'success' && (
                        <>
                            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(201,168,76,0.15)' }}>
                                <svg className="w-6 h-6" fill="none" stroke={GOLD} strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                            </div>
                            <h1 className="font-glacial text-lg text-white uppercase tracking-[2px] mb-3">Paiement confirmé</h1>
                            <p className="font-glacial text-sm text-white/55 leading-relaxed mb-8">
                                Votre inscription est confirmée. Votre reçu vient de vous être envoyé par email.
                            </p>
                            <Link to={info.slug ? `/programmes/${info.slug}` : '/programmes'} className="btn btn-gold">
                                Retour à la formation
                            </Link>
                        </>
                    )}

                    {state === 'error' && (
                        <>
                            <h1 className="font-glacial text-lg text-white uppercase tracking-[2px] mb-3">Paiement non confirmé</h1>
                            <p className="font-glacial text-sm text-white/55 leading-relaxed mb-2">
                                {info.message || 'Le paiement n\'a pas pu être confirmé.'}
                            </p>
                            {reference && (
                                <p className="font-glacial text-xs text-white/35 mb-8">Référence : <span className="font-mono">{reference}</span></p>
                            )}
                            <div className="flex flex-col gap-3 items-center">
                                {info.type === 'inscription' && info.slug && (
                                    <Link to={`/programmes/${info.slug}#inscription`} className="btn btn-gold">Réessayer le paiement</Link>
                                )}
                                {info.type === 'order' && info.id && (
                                    <Link to={`/commande/erreur/${info.id}`} className="btn btn-gold">Voir ma commande</Link>
                                )}
                                <Link to="/contact" className="font-glacial text-xs text-gold underline">Nous contacter</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
