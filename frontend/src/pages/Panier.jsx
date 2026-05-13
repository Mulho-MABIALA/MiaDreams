import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { imgSrc } from '../utils/imgSrc';

const GOLD = '#C9A84C';

export default function Panier() {
    const { items, removeItem, updateQty, subtotal, clearCart } = useCart();
    const shipping = subtotal > 0 ? 2000 : 0;
    const total = subtotal + shipping;
    const [confirmClear, setConfirmClear] = useState(false);

    if (items.length === 0) return (
        <Layout title="Mon panier — MIA DREAMS">
            <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center gap-5 px-6">
                <div className="w-16 h-16 border border-white/[0.06] flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-white/15" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                </div>
                <p className="font-lastica text-[8px] tracking-[6px] text-white/20 uppercase">Panier vide</p>
                <p className="font-glacial text-sm text-white/20 text-center max-w-[220px] leading-relaxed">
                    Découvrez nos créations et ajoutez vos favoris.
                </p>
                <Link to="/boutique" className="mt-4 font-lastica text-[8px] tracking-[4px] uppercase px-7 py-3.5"
                      style={{ background: GOLD, color: '#050505' }}>
                    DÉCOUVRIR LA BOUTIQUE
                </Link>
            </div>
        </Layout>
    );

    return (
        <Layout title="Mon panier — MIA DREAMS">
            <div className="bg-[#080808] min-h-screen pt-20 pb-16 sm:pt-24 sm:pb-24 px-4 sm:px-6 lg:px-10">
                <div className="max-w-5xl mx-auto">

                    {/* En-tête */}
                    <div className="flex items-end justify-between mb-12 pb-6 border-b border-white/[0.05]">
                        <div>
                            <span className="font-lastica text-[7px] tracking-[5px] text-white/15 uppercase block mb-2">Shopping</span>
                            <h1 className="font-glacial text-3xl lg:text-4xl text-white/80 uppercase tracking-[4px]">Mon Panier</h1>
                        </div>
                        <span className="font-lastica text-[8px] tracking-[3px] text-white/20 uppercase">
                            {items.length} article{items.length > 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-8 sm:gap-12 lg:gap-16">

                        {/* ── Articles ── */}
                        <div>
                            <div className="space-y-0 divide-y divide-white/[0.04]">
                                {items.map((item, idx) => (
                                    <div key={item.key} className="flex gap-5 py-7">
                                        {/* Image */}
                                        <Link to={`/boutique/${item.slug || ''}`}
                                              className="flex-shrink-0 overflow-hidden bg-[#111] group w-[64px] h-[80px] sm:w-[80px] sm:h-[100px]">
                                            {item.image
                                                ? <img src={imgSrc(item.image)} alt={item.name}
                                                       className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                                                : <div className="w-full h-full bg-white/[0.03]" />
                                            }
                                        </Link>

                                        {/* Infos */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-3 mb-1">
                                                <h3 className="font-glacial text-sm text-white/75 uppercase tracking-[1px] leading-snug">{item.name}</h3>
                                                <button onClick={() => removeItem(item.key)}
                                                    className="text-white/15 hover:text-white/40 transition-colors flex-shrink-0 mt-0.5">
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-4">
                                                {item.size  && <span className="font-glacial text-[11px] text-white/25">Taille : {item.size}</span>}
                                                {item.color && <span className="font-glacial text-[11px] text-white/25">{item.color}</span>}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* Quantité */}
                                                <div className="flex items-center border border-white/[0.08]">
                                                    <button onClick={() => updateQty(item.key, item.quantity - 1)}
                                                        className="w-8 h-8 text-white/30 hover:text-white/60 transition-colors font-light text-lg leading-none">
                                                        −
                                                    </button>
                                                    <span className="w-8 text-center font-glacial text-sm text-white/55">{item.quantity}</span>
                                                    <button onClick={() => updateQty(item.key, item.quantity + 1)}
                                                        className="w-8 h-8 text-white/30 hover:text-white/60 transition-colors font-light text-lg leading-none">
                                                        +
                                                    </button>
                                                </div>

                                                {/* Prix ligne */}
                                                <span className="font-glacial text-sm font-medium" style={{ color: GOLD }}>
                                                    {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.04]">
                                <Link to="/boutique"
                                    className="font-lastica text-[7px] tracking-[3px] text-white/20 hover:text-white/45 transition-colors uppercase flex items-center gap-2">
                                    <span>←</span> Continuer les achats
                                </Link>
                                {confirmClear ? (
                                    <div className="flex items-center gap-3">
                                        <span className="font-lastica text-[7px] tracking-[2px] text-white/35 uppercase">Confirmer ?</span>
                                        <button
                                            onClick={() => { clearCart(); setConfirmClear(false); }}
                                            className="font-lastica text-[7px] tracking-[2px] uppercase px-3 py-1.5 transition-all"
                                            style={{ background: '#b91c1c22', color: '#f87171', border: '1px solid #b91c1c44' }}>
                                            Oui, vider
                                        </button>
                                        <button
                                            onClick={() => setConfirmClear(false)}
                                            className="font-lastica text-[7px] tracking-[2px] text-white/30 hover:text-white/55 uppercase transition-colors">
                                            Annuler
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmClear(true)}
                                        className="font-lastica text-[7px] tracking-[3px] text-white/30 hover:text-red-400/60 transition-colors uppercase flex items-center gap-1.5">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                        Vider le panier
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ── Récapitulatif ── */}
                        <div className="lg:pt-0">
                            <div className="bg-[#0c0c0c] border border-white/[0.05] p-5 sm:p-7">
                                <p className="font-lastica text-[7px] tracking-[5px] text-white/20 uppercase mb-7">Récapitulatif</p>

                                <div className="space-y-3.5 mb-6">
                                    <div className="flex justify-between">
                                        <span className="font-glacial text-sm text-white/35">Sous-total</span>
                                        <span className="font-glacial text-sm text-white/60">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-glacial text-sm text-white/35">Livraison</span>
                                        <span className="font-glacial text-sm text-white/60">{shipping.toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                </div>

                                <div className="border-t border-white/[0.05] pt-5 mb-7">
                                    <div className="flex justify-between items-baseline">
                                        <span className="font-glacial text-sm text-white/60">Total</span>
                                        <span className="font-glacial text-xl font-medium" style={{ color: GOLD }}>
                                            {total.toLocaleString('fr-FR')} <span className="text-sm">FCFA</span>
                                        </span>
                                    </div>
                                </div>

                                <Link to="/commande"
                                    className="block w-full py-4 text-center font-lastica text-[9px] tracking-[4px] uppercase hover:brightness-110 transition-all"
                                    style={{ background: GOLD, color: '#050505' }}>
                                    PASSER LA COMMANDE →
                                </Link>

                                {/* Modes de paiement */}
                                <div className="mt-6 pt-5 border-t border-white/[0.04]">
                                    <p className="font-lastica text-[6px] tracking-[3px] text-white/15 uppercase mb-3 text-center">Paiements acceptés</p>
                                    <div className="flex items-center justify-center gap-4">
                                        {/* Wave logo */}
                                        <div className="flex items-center gap-1.5 opacity-30 hover:opacity-50 transition-opacity">
                                            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                                                <rect width="40" height="40" rx="8" fill="#1D63ED"/>
                                                <path d="M8 20c2-5 4-8 7-8s4 5 5 8 2 5 5 5 5-3 7-8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                            </svg>
                                            <span className="font-lastica text-[7px] tracking-[2px] text-white uppercase">Wave</span>
                                        </div>
                                        <div className="w-px h-4 bg-white/[0.08]" />
                                        {/* Espèces */}
                                        <div className="flex items-center gap-1.5 opacity-30 hover:opacity-50 transition-opacity">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                                                <rect x="2" y="6" width="20" height="12" rx="2"/>
                                                <circle cx="12" cy="12" r="3"/>
                                                <path d="M6 12h.01M18 12h.01"/>
                                            </svg>
                                            <span className="font-lastica text-[7px] tracking-[2px] text-white uppercase">Espèces</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
