import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useFCM } from '../hooks/useFCM';

const GOLD = '#C9A84C';

export default function CommandeSucces() {
    const { id } = useParams();
    const { t } = useLanguage();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { permission, requestPermission } = useFCM();
    const [notifDone, setNotifDone] = useState(false);

    const enableNotifications = async () => {
        const token = await requestPermission();
        if (token && id) {
            await axios.post('/api/fcm/token', { orderId: id, token }).catch(() => {});
        }
        setNotifDone(true);
    };

    // Si permission déjà accordée → récupère et enregistre le token automatiquement
    useEffect(() => {
        if (permission === 'granted' && id && !notifDone) {
            enableNotifications();
        }
    }, [permission, id]); // eslint-disable-line react-hooks/exhaustive-deps

    const STATUS_LABELS = {
        pending:    { label: t('status_pending'), color: '#C9A84C' },
        confirmed:  { label: t('status_confirmed'), color: '#7C9A84' },
        processing: { label: t('status_processing'), color: '#9A847C' },
        shipped:    { label: t('status_shipped'), color: '#7C849A' },
        delivered:  { label: t('status_delivered'), color: '#7C9A84' },
        cancelled:  { label: t('status_cancelled'), color: '#9A7C7C' },
    };
    const PAYMENT_LABELS = {
        pending: { label: t('pay_pending'), color: '#C9A84C' },
        paid:    { label: t('pay_paid'), color: '#7C9A84' },
        failed:  { label: t('pay_failed'), color: '#9A7C7C' },
    };

    useEffect(() => {
        // Récupérer le numéro de commande stocké lors du checkout (anti-IDOR)
        const orderNumber = sessionStorage.getItem(`order_num_${id}`) || '';
        axios.get(`/api/orders/public/${id}`, { params: { orderNumber } })
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
            <div className="bg-[#050505] min-h-screen pt-20 pb-12 sm:pt-28 sm:pb-20 px-4 sm:px-6 lg:px-10">
                <div className="max-w-2xl mx-auto">

                    {/* Succès */}
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-6"
                             style={{ borderColor: `${GOLD}40`, background: `${GOLD}10` }}>
                            <svg className="w-7 h-7" style={{ color: GOLD }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <p className="font-lastica text-[10px] tracking-[5px] text-white/50 uppercase mb-2">{t('success_label')}</p>
                        <h1 className="font-glacial text-3xl text-white uppercase tracking-[4px] mb-2">{t('success_title')}</h1>
                        <p className="font-glacial text-sm text-white/65">{t('success_msg')}</p>
                    </div>

                    {/* Bannière notifications push */}
                    {permission !== 'granted' && !notifDone && (
                        <div className="mb-8 border px-5 py-4 flex items-center gap-4"
                             style={{ borderColor: `${GOLD}30`, background: `${GOLD}08` }}>
                            <span className="text-xl flex-shrink-0">🔔</span>
                            <div className="flex-1 min-w-0">
                                <p className="font-lastica text-[9px] tracking-[3px] text-white/80 uppercase mb-0.5">Suivre ma commande</p>
                                <p className="font-glacial text-xs text-white/50">Recevez une notification à chaque étape de votre livraison</p>
                            </div>
                            <button onClick={enableNotifications}
                                    className="flex-shrink-0 font-lastica text-[8px] tracking-[3px] uppercase px-4 py-2.5 transition-all hover:brightness-110"
                                    style={{ background: GOLD, color: '#050505' }}>
                                Activer
                            </button>
                        </div>
                    )}
                    {notifDone && permission === 'granted' && (
                        <div className="mb-8 border px-5 py-3 flex items-center gap-3"
                             style={{ borderColor: 'rgba(124,154,132,0.3)', background: 'rgba(124,154,132,0.06)' }}>
                            <span className="text-base">✅</span>
                            <p className="font-glacial text-xs text-white/60">Notifications activées — vous serez alerté à chaque mise à jour</p>
                        </div>
                    )}

                    {/* Détails */}
                    <div className="border border-white/[0.05] p-6 mb-6" style={{ background: '#0c0c0c' }}>
                        <div className="flex items-center gap-3 mb-6">
                            <p className="font-lastica text-[10px] tracking-[4px] text-white/50 uppercase">{t('success_details')}</p>
                            <div className="flex-1 h-px bg-white/[0.04]" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div>
                                <p className="font-lastica text-[9px] tracking-[3px] text-white/50 uppercase mb-1">{t('success_number')}</p>
                                <p className="font-glacial font-medium" style={{ color: GOLD }}>{order.order_number}</p>
                            </div>
                            <div>
                                <p className="font-lastica text-[9px] tracking-[3px] text-white/50 uppercase mb-1">{t('success_date')}</p>
                                <p className="font-glacial text-white/70">
                                    {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div>
                                <p className="font-lastica text-[9px] tracking-[3px] text-white/50 uppercase mb-1">{t('success_status')}</p>
                                <span className="font-lastica text-[10px] tracking-[2px] px-2.5 py-1"
                                      style={{ background: `${orderStatus.color}20`, color: orderStatus.color }}>
                                    {orderStatus.label}
                                </span>
                            </div>
                            <div>
                                <p className="font-lastica text-[9px] tracking-[3px] text-white/50 uppercase mb-1">{t('success_payment')}</p>
                                <span className="font-lastica text-[10px] tracking-[2px] px-2.5 py-1"
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
                                        <p className="font-glacial text-[12px] text-white/55">× {item.quantity}{item.size ? ` — T. ${item.size}` : ''}</p>
                                    </div>
                                    <span className="font-glacial text-sm text-white/65">
                                        {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="border-t border-white/[0.05] pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-glacial text-white/60">{t('order_subtotal')}</span>
                                <span className="font-glacial text-white/65">{order.subtotal.toLocaleString('fr-FR')} FCFA</span>
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
                            <p className="font-lastica text-[10px] tracking-[4px] text-white/50 uppercase">{t('success_delivery')}</p>
                            <div className="flex-1 h-px bg-white/[0.04]" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="font-glacial text-sm text-white/60">{order.customer.name}</p>
                            <p className="font-glacial text-sm text-white/65">{order.customer.email}</p>
                            <p className="font-glacial text-sm text-white/65">{order.customer.phone}</p>
                            {order.customer.address && <p className="font-glacial text-sm text-white/65">{order.customer.address}, {order.customer.city}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link to={`/commande/suivi/${order.order_number}`}
                            className="w-full py-3.5 text-center font-lastica text-[9px] tracking-[4px] uppercase transition-all hover:brightness-110"
                            style={{ background: GOLD, color: '#050505' }}>
                            {t('success_track')}
                        </Link>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link to="/boutique"
                                className="flex-1 py-3.5 text-center font-lastica text-[9px] tracking-[4px] uppercase border transition-all"
                                style={{ borderColor: `${GOLD}30`, color: `${GOLD}60` }}>
                                {t('success_continue')}
                            </Link>
                            <Link to="/mes-commandes"
                                className="flex-1 py-3.5 text-center font-lastica text-[9px] tracking-[4px] uppercase border transition-all"
                                style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)' }}>
                                {t('success_my_orders')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
