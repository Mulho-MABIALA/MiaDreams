import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const GOLD = '#C9A84C';

const STEPS = [
    { key: 'pending',    label: 'Reçue',          icon: '📋' },
    { key: 'confirmed',  label: 'Confirmée',       icon: '✅' },
    { key: 'processing', label: 'En préparation',  icon: '📦' },
    { key: 'shipped',    label: 'En livraison',    icon: '🚚' },
    { key: 'delivered',  label: 'Livrée',          icon: '🎉' },
];

const STATUS_MSG = {
    pending:    'Votre commande est en attente de traitement.',
    confirmed:  'Votre commande a été confirmée et sera bientôt préparée.',
    processing: 'Votre commande est en cours de préparation.',
    shipped:    'Votre commande est en route ! La livraison est imminente.',
    delivered:  'Votre commande a été livrée. Merci pour votre confiance !',
    cancelled:  'Votre commande a été annulée. Contactez-nous pour plus d\'informations.',
};

const PAYMENT_LABELS = {
    pending:  'En attente',
    paid:     'Payé',
    failed:   'Échoué',
    refunded: 'Remboursé',
};

function Timeline({ status }) {
    if (status === 'cancelled') {
        return (
            <div className="flex items-center gap-3 py-4 px-5 border border-red-500/20 rounded-lg"
                 style={{ background: 'rgba(154,124,124,0.08)' }}>
                <span className="text-2xl">❌</span>
                <div>
                    <p className="font-glacial text-sm text-red-400/70">Commande annulée</p>
                    <p className="font-glacial text-xs text-white/30 mt-0.5">{STATUS_MSG.cancelled}</p>
                </div>
            </div>
        );
    }

    const currentIdx = STEPS.findIndex(s => s.key === status);

    return (
        <div className="space-y-0">
            {STEPS.map((step, i) => {
                const done    = i < currentIdx;
                const current = i === currentIdx;
                const future  = i > currentIdx;

                return (
                    <div key={step.key} className="flex items-stretch gap-4">
                        {/* Colonne gauche : cercle + ligne */}
                        <div className="flex flex-col items-center" style={{ width: 40 }}>
                            <div className="flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-300"
                                 style={{
                                     width: 40, height: 40,
                                     background: current ? GOLD : done ? '#7C9A84' : 'rgba(255,255,255,0.05)',
                                     border: future ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                     fontSize: current ? 18 : 14,
                                 }}>
                                {done ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                                        <path d="M5 13l4 4L19 7"/>
                                    </svg>
                                ) : (
                                    <span style={{ opacity: future ? 0.3 : 1 }}>{step.icon}</span>
                                )}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className="flex-1 w-px my-1"
                                     style={{ background: done ? '#7C9A84' : 'rgba(255,255,255,0.07)', minHeight: 24 }} />
                            )}
                        </div>

                        {/* Contenu */}
                        <div className="pb-5 pt-2 flex-1">
                            <p className="font-glacial text-sm uppercase tracking-[1px] transition-colors"
                               style={{
                                   color: current ? GOLD : done ? 'rgba(124,154,132,0.9)' : 'rgba(255,255,255,0.2)',
                                   fontWeight: current ? 600 : 400,
                               }}>
                                {step.label}
                            </p>
                            {current && (
                                <p className="font-glacial text-xs text-white/35 mt-1 leading-relaxed">
                                    {STATUS_MSG[status]}
                                </p>
                            )}
                        </div>

                        {current && (
                            <div className="pt-2">
                                <span className="font-lastica text-[7px] tracking-[2px] px-2.5 py-1 rounded-sm"
                                      style={{ background: `${GOLD}20`, color: GOLD }}>
                                    ACTUEL
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function CommandeSuivi() {
    const { number } = useParams();
    const navigate   = useNavigate();

    const [orderNumber, setOrderNumber] = useState(number || '');
    const [order,   setOrder]   = useState(null);
    const [loading, setLoading] = useState(!!number);
    const [error,   setError]   = useState('');

    const fetchOrder = async (num) => {
        if (!num?.trim()) return;
        setLoading(true);
        setError('');
        setOrder(null);
        try {
            const { data } = await axios.get(`/api/orders/track/${num.trim().toUpperCase()}`);
            setOrder(data);
            if (num.trim().toUpperCase() !== number) {
                navigate(`/commande/suivi/${num.trim().toUpperCase()}`, { replace: true });
            }
        } catch (e) {
            setError(e.response?.status === 404 ? 'Commande introuvable. Vérifiez le numéro.' : 'Erreur de connexion. Réessayez.');
        } finally { setLoading(false); }
    };

    useEffect(() => { if (number) fetchOrder(number); }, [number]);

    const handleSubmit = (e) => { e.preventDefault(); fetchOrder(orderNumber); };

    return (
        <Layout title="Suivi commande — MIA DREAMS">
            <div className="bg-[#080808] min-h-screen pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6">
                <div className="max-w-xl mx-auto">

                    {/* En-tête */}
                    <div className="mb-10">
                        <span className="font-lastica text-[7px] tracking-[5px] text-white/15 uppercase block mb-2">Boutique</span>
                        <h1 className="font-glacial text-3xl text-white/75 uppercase tracking-[4px]">Suivi commande</h1>
                    </div>

                    {/* Formulaire de recherche */}
                    <form onSubmit={handleSubmit} className="mb-10">
                        <label className="font-lastica text-[7px] tracking-[4px] text-white/40 uppercase block mb-2">
                            Numéro de commande
                        </label>
                        <div className="flex gap-2">
                            <input
                                value={orderNumber}
                                onChange={e => setOrderNumber(e.target.value.toUpperCase())}
                                placeholder="MIA-XXXXXXX"
                                className="flex-1 bg-[#0d0d0d] border border-white/[0.12] text-white/80 font-glacial text-sm px-4 py-3 outline-none focus:border-gold/50 transition-colors placeholder:text-white/20 tracking-[2px]"
                            />
                            <button type="submit" disabled={loading || !orderNumber.trim()}
                                className="px-6 py-3 font-lastica text-[8px] tracking-[3px] uppercase disabled:opacity-40 transition-all hover:brightness-110"
                                style={{ background: GOLD, color: '#050505' }}>
                                {loading ? '...' : 'OK'}
                            </button>
                        </div>
                        {error && <p className="font-glacial text-xs text-red-400/60 mt-2">{error}</p>}
                    </form>

                    {/* Résultat */}
                    {order && (
                        <div className="space-y-6">
                            {/* Infos principales */}
                            <div className="border border-white/[0.06] p-6" style={{ background: '#0c0c0c' }}>
                                <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.05]">
                                    <div>
                                        <p className="font-lastica text-[6px] tracking-[3px] text-white/20 uppercase mb-1">Commande</p>
                                        <p className="font-glacial text-lg font-medium" style={{ color: GOLD }}>{order.order_number}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-lastica text-[6px] tracking-[3px] text-white/20 uppercase mb-1">Date</p>
                                        <p className="font-glacial text-sm text-white/40">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="mb-5">
                                    <p className="font-lastica text-[6px] tracking-[3px] text-white/20 uppercase mb-4">Progression</p>
                                    <Timeline status={order.order_status} />
                                </div>

                                {/* Paiement */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                                    <span className="font-glacial text-sm text-white/40">Paiement</span>
                                    <span className="font-lastica text-[7px] tracking-[2px] px-2.5 py-1"
                                          style={{
                                              background: order.payment_status === 'paid' ? 'rgba(124,154,132,0.15)' : 'rgba(201,168,76,0.12)',
                                              color:      order.payment_status === 'paid' ? '#7C9A84' : GOLD,
                                          }}>
                                        {PAYMENT_LABELS[order.payment_status] || order.payment_status}
                                    </span>
                                </div>
                            </div>

                            {/* Articles */}
                            <div className="border border-white/[0.06] p-6" style={{ background: '#0c0c0c' }}>
                                <p className="font-lastica text-[6px] tracking-[3px] text-white/20 uppercase mb-4">Articles</p>
                                <div className="space-y-3">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <p className="font-glacial text-sm text-white/55">{item.name}</p>
                                            <span className="font-glacial text-xs text-white/30">× {item.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center pt-3 border-t border-white/[0.05]">
                                        <span className="font-glacial text-sm text-white/50">Total</span>
                                        <span className="font-glacial text-base font-medium" style={{ color: GOLD }}>
                                            {order.total.toLocaleString('fr-FR')} FCFA
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link to="/boutique"
                                    className="flex-1 py-3.5 text-center font-lastica text-[9px] tracking-[4px] uppercase transition-all hover:brightness-110"
                                    style={{ background: GOLD, color: '#050505' }}>
                                    CONTINUER LES ACHATS
                                </Link>
                                <Link to="/mes-commandes"
                                    className="flex-1 py-3.5 text-center font-lastica text-[9px] tracking-[4px] uppercase border transition-all"
                                    style={{ borderColor: `${GOLD}25`, color: `${GOLD}50` }}>
                                    MES COMMANDES
                                </Link>
                            </div>
                        </div>
                    )}

                    {!order && !loading && !number && (
                        <p className="font-glacial text-sm text-white/20 text-center mt-8">
                            Entrez votre numéro de commande pour suivre votre livraison.
                        </p>
                    )}
                </div>
            </div>
        </Layout>
    );
}
