import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';

const GOLD = '#C9A84C';

const PAYMENT_METHODS = [
    {
        id: 'wave',
        label: 'Wave',
        logo: '🌊',
        desc: 'Paiement instantané via l\'application Wave',
    },
    {
        id: 'orange_money',
        label: 'Orange Money',
        logo: '🟠',
        desc: 'Paiement via Orange Money',
    },
    {
        id: 'free_money',
        label: 'Free Money',
        logo: '💜',
        desc: 'Paiement via Free Money',
    },
    {
        id: 'cash',
        label: 'À la livraison',
        logo: '💵',
        desc: 'Paiement en espèces à la livraison',
    },
];

const inp = "w-full bg-[#080808] border border-white/[0.07] text-white/70 font-glacial text-sm px-4 py-3 outline-none focus:border-[#C9A84C]/30 transition-colors placeholder:text-white/15";

export default function Commande() {
    const { items, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const shipping = subtotal > 0 ? 2000 : 0;
    const total = subtotal + shipping;

    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: 'Abidjan', country: "Côte d'Ivoire", notes: '' });
    const [paymentMethod, setPaymentMethod] = useState('wave');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentInfo, setPaymentInfo] = useState(null);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    if (items.length === 0) return (
        <Layout title="Commande">
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 pt-24">
                <p className="font-glacial text-white/30 tracking-[3px]">Votre panier est vide</p>
                <Link to="/boutique" className="font-lastica text-[9px] tracking-[4px] px-6 py-3.5" style={{ background: GOLD, color: '#050505' }}>
                    RETOUR BOUTIQUE
                </Link>
            </div>
        </Layout>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Créer la commande
            const orderData = {
                items: items.map(i => ({
                    product_id: i.product_id,
                    name:       i.name,
                    image:      i.image,
                    price:      i.price,
                    quantity:   i.quantity,
                    size:       i.size,
                    color:      i.color,
                })),
                customer: {
                    name:    form.name,
                    email:   form.email,
                    phone:   form.phone,
                    address: form.address,
                    city:    form.city,
                    country: form.country,
                },
                subtotal,
                shipping_fee: shipping,
                total,
                payment_method: paymentMethod,
                notes: form.notes,
            };

            const { data: order } = await axios.post('/api/orders', orderData);

            // 2. Initier le paiement
            if (paymentMethod === 'cash') {
                clearCart();
                navigate(`/commande/succes/${order._id}`);
                return;
            }

            const endpoint = {
                wave:         '/api/payment/wave/init',
                orange_money: '/api/payment/orange-money/init',
                free_money:   '/api/payment/free-money/init',
            }[paymentMethod];

            const { data: payment } = await axios.post(endpoint, {
                orderId: order._id,
                phone:   form.phone,
            });

            if (payment.checkout_url) {
                clearCart();
                window.location.href = payment.checkout_url;
            } else if (payment.status === 'instructions') {
                setPaymentInfo({ message: payment.message, orderId: order._id, orderNumber: payment.order_number });
                clearCart();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    // Afficher les instructions de paiement manuel
    if (paymentInfo) return (
        <Layout title="Instructions de paiement">
            <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 pt-24">
                <div className="max-w-md w-full border border-white/[0.06] p-10 text-center" style={{ background: '#0c0c0c' }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <span className="text-2xl">💳</span>
                    </div>
                    <p className="font-lastica text-[7px] tracking-[4px] text-white/20 uppercase mb-2">Instructions de paiement</p>
                    <p className="font-lastica text-[8px] tracking-[3px] mb-6" style={{ color: GOLD }}>Commande {paymentInfo.orderNumber}</p>
                    <p className="font-glacial text-sm text-white/50 leading-relaxed mb-8">{paymentInfo.message}</p>
                    <Link to={`/commande/succes/${paymentInfo.orderId}`}
                        className="block w-full py-3.5 font-lastica text-[9px] tracking-[3px] uppercase text-center"
                        style={{ background: GOLD, color: '#050505' }}>
                        J'AI EFFECTUÉ LE PAIEMENT
                    </Link>
                </div>
            </div>
        </Layout>
    );

    return (
        <Layout title="Finaliser ma commande — MIA DREAMS">
            <div className="bg-[#050505] min-h-screen pt-28 pb-20 px-6 lg:px-10">
                <div className="max-w-5xl mx-auto">

                    <div className="mb-10">
                        <p className="font-lastica text-[7px] tracking-[5px] text-white/15 uppercase mb-1">Boutique</p>
                        <h1 className="font-glacial text-3xl text-white/80 uppercase tracking-[4px]">Finaliser la commande</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
                            <div className="space-y-8">

                                {/* Informations client */}
                                <div className="border border-white/[0.05] p-6" style={{ background: '#0c0c0c' }}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <p className="font-lastica text-[7px] tracking-[4px] text-white/20 uppercase">Vos informations</p>
                                        <div className="flex-1 h-px bg-white/[0.04]" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="font-lastica text-[7px] tracking-[3px] text-white/25 uppercase block mb-2">Nom complet *</label>
                                            <input className={inp} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Aminata Koné" />
                                        </div>
                                        <div>
                                            <label className="font-lastica text-[7px] tracking-[3px] text-white/25 uppercase block mb-2">Email *</label>
                                            <input type="email" className={inp} required value={form.email} onChange={e => set('email', e.target.value)} placeholder="aminata@email.com" />
                                        </div>
                                        <div>
                                            <label className="font-lastica text-[7px] tracking-[3px] text-white/25 uppercase block mb-2">Téléphone *</label>
                                            <input className={inp} required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+225 07 00 00 00 00" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="font-lastica text-[7px] tracking-[3px] text-white/25 uppercase block mb-2">Adresse de livraison</label>
                                            <input className={inp} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Quartier, rue, N°…" />
                                        </div>
                                        <div>
                                            <label className="font-lastica text-[7px] tracking-[3px] text-white/25 uppercase block mb-2">Ville</label>
                                            <input className={inp} value={form.city} onChange={e => set('city', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="font-lastica text-[7px] tracking-[3px] text-white/25 uppercase block mb-2">Pays</label>
                                            <input className={inp} value={form.country} onChange={e => set('country', e.target.value)} />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="font-lastica text-[7px] tracking-[3px] text-white/25 uppercase block mb-2">Notes (optionnel)</label>
                                            <textarea className={inp + " resize-none"} rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Instructions de livraison, remarques…" />
                                        </div>
                                    </div>
                                </div>

                                {/* Mode de paiement */}
                                <div className="border border-white/[0.05] p-6" style={{ background: '#0c0c0c' }}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <p className="font-lastica text-[7px] tracking-[4px] text-white/20 uppercase">Mode de paiement</p>
                                        <div className="flex-1 h-px bg-white/[0.04]" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {PAYMENT_METHODS.map(m => (
                                            <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                                                className="flex items-center gap-4 p-4 border text-left transition-all"
                                                style={paymentMethod === m.id
                                                    ? { borderColor: GOLD, background: `${GOLD}08` }
                                                    : { borderColor: '#ffffff08', background: '#080808' }}>
                                                <span className="text-2xl flex-shrink-0">{m.logo}</span>
                                                <div>
                                                    <p className="font-lastica text-[8px] tracking-[2px] uppercase"
                                                       style={{ color: paymentMethod === m.id ? GOLD : 'rgba(255,255,255,0.5)' }}>
                                                        {m.label}
                                                    </p>
                                                    <p className="font-glacial text-[11px] text-white/25 mt-0.5">{m.desc}</p>
                                                </div>
                                                <div className="ml-auto w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                                                     style={{ borderColor: paymentMethod === m.id ? GOLD : '#ffffff20' }}>
                                                    {paymentMethod === m.id && (
                                                        <div className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Récapitulatif commande */}
                            <div className="h-fit">
                                <div className="border border-white/[0.05] p-6 mb-4" style={{ background: '#0c0c0c' }}>
                                    <div className="flex items-center gap-3 mb-5">
                                        <p className="font-lastica text-[7px] tracking-[4px] text-white/20 uppercase">Ma commande</p>
                                        <div className="flex-1 h-px bg-white/[0.04]" />
                                    </div>

                                    <div className="space-y-3 mb-5">
                                        {items.map(item => (
                                            <div key={item.key} className="flex justify-between items-start gap-3">
                                                <div className="flex gap-3 flex-1 min-w-0">
                                                    {item.image && (
                                                        <img src={`/uploads/${item.image}`} className="w-12 h-14 object-cover flex-shrink-0" alt={item.name} style={{ background: '#111' }} />
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="font-glacial text-xs text-white/60 uppercase tracking-[0.5px] truncate">{item.name}</p>
                                                        {item.size && <p className="font-glacial text-[10px] text-white/25">T. {item.size}</p>}
                                                        <p className="font-glacial text-[10px] text-white/25">× {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <span className="font-glacial text-sm text-white/50 flex-shrink-0">
                                                    {(item.price * item.quantity).toLocaleString('fr-FR')} F
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-white/[0.05]">
                                        <div className="flex justify-between">
                                            <span className="font-glacial text-sm text-white/35">Sous-total</span>
                                            <span className="font-glacial text-sm text-white/50">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-glacial text-sm text-white/35">Livraison</span>
                                            <span className="font-glacial text-sm text-white/50">{shipping.toLocaleString('fr-FR')} FCFA</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-white/[0.05]">
                                            <span className="font-glacial text-sm text-white/70">Total</span>
                                            <span className="font-glacial text-base font-medium" style={{ color: GOLD }}>
                                                {total.toLocaleString('fr-FR')} FCFA
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <p className="font-glacial text-xs text-red-400/80 mb-4 text-center">{error}</p>
                                )}

                                <button type="submit" disabled={loading}
                                    className="w-full py-4 font-lastica text-[9px] tracking-[4px] uppercase disabled:opacity-50 transition-all hover:brightness-110"
                                    style={{ background: GOLD, color: '#050505' }}>
                                    {loading ? 'Traitement…' : 'CONFIRMER ET PAYER'}
                                </button>

                                <Link to="/panier" className="block text-center mt-4 font-lastica text-[7px] tracking-[3px] text-white/20 hover:text-white/40 transition-colors uppercase">
                                    ← Modifier le panier
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
