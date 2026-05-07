import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const GOLD = '#C9A84C';

const STATUS_LABELS = {
    pending:    { label: 'En attente', color: '#C9A84C' },
    confirmed:  { label: 'Confirmée', color: '#7C9A84' },
    processing: { label: 'En préparation', color: '#9A847C' },
    shipped:    { label: 'En livraison', color: '#7C849A' },
    delivered:  { label: 'Livrée', color: '#7C9A84' },
    cancelled:  { label: 'Annulée', color: '#9A7C7C' },
};

const PAYMENT_LABELS = {
    pending: { label: 'En attente', color: '#C9A84C' },
    paid:    { label: 'Payé', color: '#7C9A84' },
    failed:  { label: 'Échoué', color: '#9A7C7C' },
};

export default function CommandeSucces() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/orders/${id}`)
            .then(r => setOrder(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <Layout title="Commande confirmée">
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-8 h-px" style={{ background: `${GOLD}40` }} />
            </div>
        </Layout>
    );

    if (!order) return (
        <Layout title="Commande introuvable">
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 pt-24">
                <p className="font-glacial text-white/30 tracking-[3px]">Commande introuvable</p>
                <Link to="/boutique" className="font-lastica text-[9px] tracking-[4px] px-6 py-3.5" style={{ background: GOLD, color: '#050505' }}>
                    RETOUR BOUTIQUE
                </Link>
            </div>
        </Layout>
    );

    const orderStatus  = STATUS_LABELS[order.order_status]  || STATUS_LABELS.pending;
    const payStatus    = PAYMENT_LABELS[order.payment_status] || PAYMENT_LABELS.pending;

    return (
        <Layout title={`Commande ${order.order_number} — MIA DREAMS`}>
            <div className="bg-[#050505] min-h-screen pt-28 pb-20 px-6 lg:px-10">
                <div className="max-w-2xl mx-auto">

                    {/* Succès */}
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-6"
                             style={{ borderColor: `${GOLD}40`, background: `${GOLD}10` }}>
                            <svg className="w-7 h-7" style={{ color: GOLD }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <p className="font-lastica text-[7px] tracking-[5px] text-white/20 uppercase mb-2">Commande reçue</p>
                        <h1 className="font-glacial text-3xl text-white/80 uppercase tracking-[4px] mb-2">Merci !</h1>
                        <p className="font-glacial text-sm text-white/40">Votre commande a bien été enregistrée.</p>
                    </div>

                    {/* Détails */}
                    <div className="border border-white/[0.05] p-6 mb-6" style={{ background: '#0c0c0c' }}>
                        <div className="flex items-center gap-3 mb-6">
                            <p className="font-lastica text-[7px] tracking-[4px] text-white/20 uppercase">Détails de la commande</p>
                            <div className="flex-1 h-px bg-white/[0.04]" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div>
                                <p className="font-lastica text-[6px] tracking-[3px] text-white/20 uppercase mb-1">N° commande</p>
                                <p className="font-glacial font-medium" style={{ color: GOLD }}>{order.order_number}</p>
                            </div>
                            <div>
                                <p className="font-lastica text-[6px] tracking-[3px] text-white/20 uppercase mb-1">Date</p>
                                <p className="font-glacial text-white/50">
                                    {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div>
                                <p className="font-lastica text-[6px] tracking-[3px] text-white/20 uppercase mb-1">Statut commande</p>
                                <span className="font-lastica text-[7px] tracking-[2px] px-2.5 py-1"
                                      style={{ background: `${orderStatus.color}20`, color: orderStatus.color }}>
                                    {orderStatus.label}
                                </span>
                            </div>
                            <div>
                                <p className="font-lastica text-[6px] tracking-[3px] text-white/20 uppercase mb-1">Paiement</p>
                                <span className="font-lastica text-[7px] tracking-[2px] px-2.5 py-1"
                                      style={{ background: `${payStatus.color}20`, color: payStatus.color }}>
                                    {payStatus.label}
                                </span>
                            </div>
                        </div>

                        {/* Articles */}
                        <div className="border-t border-white/[0.05] pt-5 mb-5 space-y-3">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-glacial text-sm text-white/60">{item.name}</p>
                                        <p className="font-glacial text-[10px] text-white/25">× {item.quantity}{item.size ? ` — T. ${item.size}` : ''}</p>
                                    </div>
                                    <span className="font-glacial text-sm text-white/40">
                                        {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="border-t border-white/[0.05] pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-glacial text-white/35">Sous-total</span>
                                <span className="font-glacial text-white/45">{order.subtotal.toLocaleString('fr-FR')} FCFA</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-glacial text-white/35">Livraison</span>
                                <span className="font-glacial text-white/45">{order.shipping_fee.toLocaleString('fr-FR')} FCFA</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-glacial text-sm text-white/70">Total</span>
                                <span className="font-glacial text-base font-medium" style={{ color: GOLD }}>
                                    {order.total.toLocaleString('fr-FR')} FCFA
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Client */}
                    <div className="border border-white/[0.05] p-6 mb-8" style={{ background: '#0c0c0c' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <p className="font-lastica text-[7px] tracking-[4px] text-white/20 uppercase">Livraison</p>
                            <div className="flex-1 h-px bg-white/[0.04]" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="font-glacial text-sm text-white/60">{order.customer.name}</p>
                            <p className="font-glacial text-sm text-white/40">{order.customer.email}</p>
                            <p className="font-glacial text-sm text-white/40">{order.customer.phone}</p>
                            {order.customer.address && <p className="font-glacial text-sm text-white/40">{order.customer.address}, {order.customer.city}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link to="/boutique"
                            className="flex-1 py-3.5 text-center font-lastica text-[9px] tracking-[4px] uppercase transition-all hover:brightness-110"
                            style={{ background: GOLD, color: '#050505' }}>
                            CONTINUER LES ACHATS
                        </Link>
                        <Link to="/mes-commandes"
                            className="flex-1 py-3.5 text-center font-lastica text-[9px] tracking-[4px] uppercase border transition-all"
                            style={{ borderColor: `${GOLD}30`, color: `${GOLD}60` }}>
                            MES COMMANDES
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
