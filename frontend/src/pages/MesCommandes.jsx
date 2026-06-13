import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';

const GOLD = '#C9A84C';

export default function MesCommandes() {
    const { t } = useLanguage();
    const STATUS = {
        pending:    { label: t('status_pending'), color: '#C9A84C' },
        confirmed:  { label: t('status_confirmed'), color: '#7C9A84' },
        processing: { label: t('status_processing'), color: '#9A847C' },
        shipped:    { label: t('status_shipped'), color: '#7C849A' },
        delivered:  { label: t('status_delivered'), color: '#7C9A84' },
        cancelled:  { label: t('status_cancelled'), color: '#9A7C7C' },
    };
    const PAYMENT = {
        pending: { label: t('pay_pending'), color: '#C9A84C' },
        paid:    { label: t('pay_paid'), color: '#7C9A84' },
        failed:  { label: t('pay_failed'), color: '#9A7C7C' },
    };
    const [email, setEmail] = useState('');
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setError('');
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/orders/email/${encodeURIComponent(email.trim())}`);
            setOrders(data);
            if (data.length === 0) setError(t('my_orders_empty'));
        } catch {
            setError(t('my_orders_error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Mes commandes — MIA DREAMS">
            <div className="bg-[#050505] min-h-screen pt-20 pb-12 sm:pt-28 sm:pb-20 px-4 sm:px-6 lg:px-10">
                <div className="max-w-3xl mx-auto">

                    <div className="mb-10">
                        <p className="font-lastica text-[7px] tracking-[5px] text-white/15 uppercase mb-1">{t('my_orders_tracking')}</p>
                        <h1 className="font-glacial text-3xl text-white/80 uppercase tracking-[4px]">{t('my_orders_title')}</h1>
                    </div>

                    {/* Recherche par email */}
                    <div className="border border-white/[0.05] p-6 mb-8" style={{ background: '#0c0c0c' }}>
                        <div className="flex items-center gap-3 mb-5">
                            <p className="font-lastica text-[7px] tracking-[4px] text-white/20 uppercase">{t('my_orders_find')}</p>
                            <div className="flex-1 h-px bg-white/[0.04]" />
                        </div>
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder={t('my_orders_placeholder')}
                                className="flex-1 bg-[#080808] border border-white/[0.07] text-white/70 font-glacial text-sm px-4 py-3 outline-none focus:border-[#C9A84C]/30 transition-colors placeholder:text-white/15"
                            />
                            <button type="submit" disabled={loading}
                                className="font-lastica text-[8px] tracking-[3px] px-6 py-3 disabled:opacity-50 flex-shrink-0"
                                style={{ background: GOLD, color: '#050505' }}>
                                {loading ? '…' : t('my_orders_search')}
                            </button>
                        </form>
                        {error && <p className="font-glacial text-xs text-red-400/70 mt-3">{error}</p>}
                    </div>

                    {/* Liste des commandes */}
                    {orders !== null && orders.length > 0 && (
                        <div className="space-y-4">
                            {orders.map(order => {
                                const os = STATUS[order.order_status] || STATUS.pending;
                                const ps = PAYMENT[order.payment_status] || PAYMENT.pending;
                                return (
                                    <div key={order._id} className="border border-white/[0.05] p-5" style={{ background: '#0c0c0c' }}>
                                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                                            <div>
                                                <p className="font-lastica text-[8px] tracking-[3px] mb-1" style={{ color: GOLD }}>
                                                    {order.order_number}
                                                </p>
                                                <p className="font-glacial text-xs text-white/30">
                                                    {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                <span className="font-lastica text-[6px] tracking-[2px] px-2 py-1"
                                                      style={{ background: `${os.color}20`, color: os.color }}>
                                                    {os.label}
                                                </span>
                                                <span className="font-lastica text-[6px] tracking-[2px] px-2 py-1"
                                                      style={{ background: `${ps.color}20`, color: ps.color }}>
                                                    {ps.label}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 mb-4">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span className="font-glacial text-white/50">
                                                        {item.name} × {item.quantity}{item.size ? ` (${item.size})` : ''}
                                                    </span>
                                                    <span className="font-glacial text-white/35">
                                                        {(item.price * item.quantity).toLocaleString('fr-FR')} F
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                                            <span className="font-glacial text-sm" style={{ color: GOLD }}>
                                                {order.total.toLocaleString('fr-FR')} FCFA
                                            </span>
                                            <Link to={`/commande/succes/${order._id}`}
                                                className="font-lastica text-[7px] tracking-[2px] text-white/20 hover:text-white/50 border border-white/[0.05] hover:border-white/10 px-3 py-1.5 transition-all uppercase">
                                                {t('my_orders_view')}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
