import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { imgSrc } from '../utils/imgSrc';
import { useLanguage } from '../context/LanguageContext';
import { useFCM } from '../hooks/useFCM';

const GOLD = '#C9A84C';

/* ── Logo CinetPay ── */
function CinetPayLogo({ size = 36 }) {
    return (
        <div style={{ width: size, height: size, background: 'linear-gradient(135deg,#FF6B00,#FF9A00)', borderRadius: 8 }}
             className="flex items-center justify-center flex-shrink-0">
            <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
        </div>
    );
}

const PAYMENT_METHODS_KEYS = [
    {
        id: 'cinetpay',
        labelKey: 'order_pay_online',
        desc: 'Wave CI · Orange Money · MTN · Moov · Free Money · Carte bancaire',
        logo: <CinetPayLogo size={36} />,
    },
    {
        id: 'cash',
        labelKey: 'order_pay_cash',
        descKey: 'order_pay_cash_desc',
        logo: (
            <div className="w-9 h-9 border border-white/15 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.5">
                    <rect x="2" y="6" width="20" height="12" rx="2"/>
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M6 12h.01M18 12h.01"/>
                </svg>
            </div>
        ),
    },
];

const inp = "w-full bg-[#0d0d0d] border border-white/[0.18] text-white/90 font-glacial text-sm px-4 py-3 outline-none focus:border-gold/50 transition-colors placeholder:text-white/25 rounded-none";
const label = "font-lastica text-[10px] tracking-[3px] text-white/70 uppercase block mb-2";

export default function Commande() {
    const { items, subtotal, clearCart } = useCart();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { requestPermission } = useFCM();
    const shipping = 0;
    const total = subtotal;

    const [form, setForm] = useState({
        name: '', email: '', phone: '', address: '', city: 'Abidjan', country: "Côte d'Ivoire", notes: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('cinetpay');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const PAYMENT_METHODS = PAYMENT_METHODS_KEYS.map(m => ({
        ...m,
        label: t(m.labelKey),
        desc: m.descKey ? t(m.descKey) : m.desc,
    }));

    /* Panier vide */
    if (items.length === 0) return (
        <Layout title="Commande">
            <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center gap-5 px-6">
                <p className="font-lastica text-[8px] tracking-[5px] text-white/50 uppercase">{t('order_empty')}</p>
                <Link to="/boutique" className="font-lastica text-[8px] tracking-[4px] uppercase px-7 py-3.5"
                      style={{ background: GOLD, color: '#050505' }}>
                    {t('order_back_shop')}
                </Link>
            </div>
        </Layout>
    );

    /* Soumission */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const { data: order } = await axios.post('/api/orders', {
                items: items.map(i => ({
                    product_id: i.product_id, name: i.name, image: i.image,
                    price: i.price, quantity: i.quantity, size: i.size, color: i.color,
                })),
                customer: { name: form.name, email: form.email, phone: form.phone, address: form.address, city: form.city, country: form.country },
                subtotal, shipping_fee: shipping, total, payment_method: paymentMethod, notes: form.notes,
            });
            axios.post('/api/newsletter', { email: form.email }).catch(() => {});

            // Stocker le numéro de commande pour la page de succès (anti-IDOR)
            sessionStorage.setItem(`order_num_${order._id}`, order.order_number);

            // Demander permission push et enregistrer le token FCM
            requestPermission().then(fcmToken => {
                if (fcmToken) {
                    axios.post('/api/fcm/token', { orderId: order._id, token: fcmToken }).catch(() => {});
                }
            });

            if (paymentMethod === 'cash') {
                clearCart(); navigate(`/commande/succes/${order._id}`); return;
            }

            // CinetPay — redirige vers la page de paiement (Wave, OM, MTN, Moov, Free, Carte…)
            const { data: payment } = await axios.post('/api/payment/cinetpay/init', { orderId: order._id });

            if (payment.payment_url) {
                clearCart(); window.location.href = payment.payment_url;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally { setLoading(false); }
    };

    return (
        <Layout title="Finaliser ma commande — MIA DREAMS">
            <div className="bg-[#080808] min-h-screen pt-20 pb-16 sm:pt-24 sm:pb-24 px-4 sm:px-6 lg:px-10">
                <div className="max-w-5xl mx-auto">

                    {/* En-tête */}
                    <div className="mb-12 pb-6 border-b border-white/[0.05]">
                        <span className="font-lastica text-[10px] tracking-[5px] text-white/45 uppercase block mb-2">{t('order_breadcrumb')}</span>
                        <h1 className="font-glacial text-3xl lg:text-4xl text-white uppercase tracking-[4px]">{t('order_title')}</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 sm:gap-12 lg:gap-16">

                            {/* ── Formulaire ── */}
                            <div className="space-y-8">

                                {/* Infos client */}
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="font-lastica text-[10px] tracking-[5px] text-white/40 uppercase">01</span>
                                        <div className="h-px flex-1 bg-white/[0.08]" />
                                        <span className="font-lastica text-[10px] tracking-[4px] text-white/40 uppercase">{t('order_your_info')}</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className={label}>{t('order_fullname')}</label>
                                            <input className={inp} required value={form.name} onChange={e => set('name', e.target.value)} placeholder={t('order_ph_name')} />
                                        </div>
                                        <div>
                                            <label className={label}>{t('order_email')}</label>
                                            <input type="email" className={inp} required value={form.email} onChange={e => set('email', e.target.value)} placeholder={t('order_ph_email')} />
                                        </div>
                                        <div>
                                            <label className={label}>{t('order_phone')}</label>
                                            <input className={inp} required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder={t('order_ph_phone')} />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className={label}>{t('order_address')}</label>
                                            <input className={inp} value={form.address} onChange={e => set('address', e.target.value)} placeholder={t('order_ph_address')} />
                                        </div>
                                        <div>
                                            <label className={label}>{t('order_city')}</label>
                                            <input className={inp} value={form.city} onChange={e => set('city', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={label}>{t('order_country')}</label>
                                            <input className={inp} value={form.country} onChange={e => set('country', e.target.value)} />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className={label}>{t('order_notes')}</label>
                                            <textarea className={inp + " resize-none"} rows={3} value={form.notes}
                                                onChange={e => set('notes', e.target.value)}
                                                placeholder={t('order_ph_notes')} />
                                        </div>
                                    </div>
                                </div>

                                {/* Mode de paiement */}
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="font-lastica text-[10px] tracking-[5px] text-white/40 uppercase">02</span>
                                        <div className="h-px flex-1 bg-white/[0.08]" />
                                        <span className="font-lastica text-[10px] tracking-[4px] text-white/40 uppercase">{t('order_payment_mode')}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {PAYMENT_METHODS.map(m => (
                                            <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                                                className="w-full flex items-center gap-5 p-5 border text-left transition-all duration-200"
                                                style={paymentMethod === m.id
                                                    ? { borderColor: `${GOLD}55`, background: `${GOLD}06` }
                                                    : { borderColor: 'rgba(255,255,255,.05)', background: '#0c0c0c' }}>
                                                {/* Logo */}
                                                <div className="flex-shrink-0">{m.logo}</div>

                                                {/* Texte */}
                                                <div className="flex-1">
                                                    <p className="font-glacial text-sm uppercase tracking-[1px] mb-0.5 transition-colors"
                                                       style={{ color: paymentMethod === m.id ? GOLD : 'rgba(255,255,255,.6)' }}>
                                                        {m.label}
                                                    </p>
                                                    <p className="font-glacial text-sm text-white/55 leading-relaxed">{m.desc}</p>
                                                </div>

                                                {/* Radio */}
                                                <div className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                                                     style={{ borderColor: paymentMethod === m.id ? GOLD : 'rgba(255,255,255,.15)' }}>
                                                    {paymentMethod === m.id && (
                                                        <div className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ── Récapitulatif ── */}
                            <div>
                                <div className="bg-[#0c0c0c] border border-white/[0.05] p-5 sm:p-7 lg:sticky lg:top-24">
                                    <p className="font-lastica text-[10px] tracking-[5px] text-white/65 uppercase mb-6">{t('order_summary')}</p>

                                    {/* Articles */}
                                    <div className="space-y-4 mb-6">
                                        {items.map(item => (
                                            <div key={item.key} className="flex gap-3 items-start">
                                                <div className="flex-shrink-0 overflow-hidden bg-[#111]" style={{ width: 48, height: 60 }}>
                                                    {item.image
                                                        ? <img src={imgSrc(item.image)} alt={item.name} className="w-full h-full object-cover" />
                                                        : <div className="w-full h-full bg-white/[0.03]" />
                                                    }
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-glacial text-sm text-white/75 uppercase tracking-[.5px] truncate leading-snug">{item.name}</p>
                                                    {item.size && <p className="font-glacial text-[12px] text-white/40 mt-0.5">T. {item.size}</p>}
                                                    <p className="font-glacial text-[12px] text-white/40">× {item.quantity}</p>
                                                </div>
                                                <span className="font-glacial text-xs text-white/65 flex-shrink-0">
                                                    {(item.price * item.quantity).toLocaleString('fr-FR')} F
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Totaux */}
                                    <div className="border-t border-white/[0.05] pt-5 space-y-3 mb-7">
                                        <div className="flex justify-between">
                                            <span className="font-glacial text-sm text-white/50">{t('order_subtotal')}</span>
                                            <span className="font-glacial text-sm text-white/70">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                                        </div>
                                        <div className="flex justify-between pt-3 border-t border-white/[0.08]">
                                            <span className="font-glacial text-sm text-white/75">{t('order_total')}</span>
                                            <span className="font-glacial text-lg font-medium" style={{ color: GOLD }}>
                                                {total.toLocaleString('fr-FR')} <span className="text-sm">FCFA</span>
                                            </span>
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="font-glacial text-xs text-red-400/70 mb-4 text-center leading-relaxed">{error}</p>
                                    )}

                                    <button type="submit" disabled={loading}
                                        className="w-full py-4 font-lastica text-[9px] tracking-[4px] uppercase disabled:opacity-40 hover:brightness-110 transition-all"
                                        style={{ background: GOLD, color: '#050505' }}>
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-3">
                                                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" strokeOpacity=".2"/>
                                                    <path d="M12 2a10 10 0 0110 10"/>
                                                </svg>
                                                {t('loading')}
                                            </span>
                                        ) : paymentMethod === 'cinetpay' ? t('order_pay_btn') : t('order_confirm_btn')}
                                    </button>

                                    <Link to="/panier"
                                        className="block text-center mt-4 font-lastica text-[10px] tracking-[3px] text-white/45 hover:text-white/38 transition-colors uppercase">
                                        {t('order_back_cart')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
