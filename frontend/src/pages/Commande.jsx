import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { imgSrc } from '../utils/imgSrc';

const GOLD = '#C9A84C';

/* ── Logo Wave SVG officiel ── */
function WaveLogo({ size = 32 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" rx="44" fill="#1D63ED"/>
            <path d="M30 100 C50 55, 75 55, 90 100 C105 145, 125 145, 145 100 C160 60, 175 60, 185 80"
                  stroke="white" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
    );
}

const PAYMENT_METHODS = [
    {
        id: 'wave',
        label: 'Wave',
        desc: "Paiement instantané via l'application Wave CI",
        logo: <WaveLogo size={36} />,
    },
    {
        id: 'cash',
        label: 'Espèces à la livraison',
        desc: 'Payez en cash à la réception de votre commande',
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
const label = "font-lastica text-[7px] tracking-[3px] text-white/50 uppercase block mb-2";

export default function Commande() {
    const { items, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const shipping = subtotal > 0 ? 2000 : 0;
    const total = subtotal + shipping;

    const [form, setForm] = useState({
        name: '', email: '', phone: '', address: '', city: 'Abidjan', country: "Côte d'Ivoire", notes: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('wave');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentInfo, setPaymentInfo] = useState(null);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    /* Panier vide */
    if (items.length === 0) return (
        <Layout title="Commande">
            <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center gap-5 px-6">
                <p className="font-lastica text-[8px] tracking-[5px] text-white/20 uppercase">Panier vide</p>
                <Link to="/boutique" className="font-lastica text-[8px] tracking-[4px] uppercase px-7 py-3.5"
                      style={{ background: GOLD, color: '#050505' }}>
                    RETOUR BOUTIQUE
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

            if (paymentMethod === 'cash') {
                clearCart(); navigate(`/commande/succes/${order._id}`); return;
            }

            const { data: payment } = await axios.post('/api/payment/wave/init', { orderId: order._id, phone: form.phone });

            if (payment.checkout_url) {
                clearCart(); window.location.href = payment.checkout_url;
            } else if (payment.status === 'instructions') {
                setPaymentInfo({ message: payment.message, orderId: order._id, orderNumber: payment.order_number });
                clearCart();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally { setLoading(false); }
    };

    /* Instructions paiement manuel */
    if (paymentInfo) return (
        <Layout title="Instructions de paiement">
            <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6 pt-20">
                <div className="max-w-sm w-full border border-white/[0.05] p-10 text-center bg-[#0c0c0c]">
                    <div className="flex justify-center mb-6"><WaveLogo size={48} /></div>
                    <p className="font-lastica text-[7px] tracking-[4px] text-white/20 uppercase mb-2">Instructions Wave</p>
                    <p className="font-lastica text-[8px] tracking-[3px] mb-6" style={{ color: GOLD }}>
                        Commande {paymentInfo.orderNumber}
                    </p>
                    <p className="font-glacial text-sm text-white/45 leading-relaxed mb-8">{paymentInfo.message}</p>
                    <Link to={`/commande/succes/${paymentInfo.orderId}`}
                        className="block w-full py-4 font-lastica text-[8px] tracking-[3px] uppercase text-center"
                        style={{ background: GOLD, color: '#050505' }}>
                        J'AI PAYÉ →
                    </Link>
                </div>
            </div>
        </Layout>
    );

    return (
        <Layout title="Finaliser ma commande — MIA DREAMS">
            <div className="bg-[#080808] min-h-screen pt-20 pb-16 sm:pt-24 sm:pb-24 px-4 sm:px-6 lg:px-10">
                <div className="max-w-5xl mx-auto">

                    {/* En-tête */}
                    <div className="mb-12 pb-6 border-b border-white/[0.05]">
                        <span className="font-lastica text-[7px] tracking-[5px] text-white/15 uppercase block mb-2">Boutique</span>
                        <h1 className="font-glacial text-3xl lg:text-4xl text-white/80 uppercase tracking-[4px]">Finaliser la commande</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 sm:gap-12 lg:gap-16">

                            {/* ── Formulaire ── */}
                            <div className="space-y-8">

                                {/* Infos client */}
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="font-lastica text-[7px] tracking-[5px] text-white/40 uppercase">01</span>
                                        <div className="h-px flex-1 bg-white/[0.08]" />
                                        <span className="font-lastica text-[7px] tracking-[4px] text-white/40 uppercase">Vos informations</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className={label}>Nom complet *</label>
                                            <input className={inp} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Aminata Koné" />
                                        </div>
                                        <div>
                                            <label className={label}>Email *</label>
                                            <input type="email" className={inp} required value={form.email} onChange={e => set('email', e.target.value)} placeholder="aminata@email.com" />
                                        </div>
                                        <div>
                                            <label className={label}>Téléphone *</label>
                                            <input className={inp} required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+225 07 00 00 00 00" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className={label}>Adresse de livraison</label>
                                            <input className={inp} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Quartier, rue, numéro…" />
                                        </div>
                                        <div>
                                            <label className={label}>Ville</label>
                                            <input className={inp} value={form.city} onChange={e => set('city', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={label}>Pays</label>
                                            <input className={inp} value={form.country} onChange={e => set('country', e.target.value)} />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className={label}>Notes (optionnel)</label>
                                            <textarea className={inp + " resize-none"} rows={3} value={form.notes}
                                                onChange={e => set('notes', e.target.value)}
                                                placeholder="Instructions de livraison…" />
                                        </div>
                                    </div>
                                </div>

                                {/* Mode de paiement */}
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="font-lastica text-[7px] tracking-[5px] text-white/40 uppercase">02</span>
                                        <div className="h-px flex-1 bg-white/[0.08]" />
                                        <span className="font-lastica text-[7px] tracking-[4px] text-white/40 uppercase">Mode de paiement</span>
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
                                                    <p className="font-glacial text-xs text-white/25 leading-relaxed">{m.desc}</p>
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
                                    <p className="font-lastica text-[7px] tracking-[5px] text-white/45 uppercase mb-6">Ma commande</p>

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
                                                    <p className="font-glacial text-xs text-white/75 uppercase tracking-[.5px] truncate leading-snug">{item.name}</p>
                                                    {item.size && <p className="font-glacial text-[10px] text-white/40 mt-0.5">T. {item.size}</p>}
                                                    <p className="font-glacial text-[10px] text-white/40">× {item.quantity}</p>
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
                                            <span className="font-glacial text-sm text-white/50">Sous-total</span>
                                            <span className="font-glacial text-sm text-white/70">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-glacial text-sm text-white/50">Livraison</span>
                                            <span className="font-glacial text-sm text-white/70">{shipping.toLocaleString('fr-FR')} FCFA</span>
                                        </div>
                                        <div className="flex justify-between pt-3 border-t border-white/[0.08]">
                                            <span className="font-glacial text-sm text-white/75">Total</span>
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
                                                Traitement…
                                            </span>
                                        ) : paymentMethod === 'wave' ? 'PAYER AVEC WAVE →' : 'CONFIRMER LA COMMANDE →'}
                                    </button>

                                    <Link to="/panier"
                                        className="block text-center mt-4 font-lastica text-[7px] tracking-[3px] text-white/18 hover:text-white/38 transition-colors uppercase">
                                        ← Modifier le panier
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
