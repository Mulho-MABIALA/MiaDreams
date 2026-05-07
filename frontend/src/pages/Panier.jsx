import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';

const GOLD = '#C9A84C';

export default function Panier() {
    const { items, removeItem, updateQty, subtotal, clearCart } = useCart();

    const shipping = subtotal > 0 ? 2000 : 0;
    const total = subtotal + shipping;

    if (items.length === 0) return (
        <Layout title="Mon panier — MIA DREAMS">
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 px-6 pt-24">
                <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-2">
                    <svg className="w-7 h-7 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                </div>
                <h1 className="font-glacial text-2xl text-white/40 uppercase tracking-[4px]">Panier vide</h1>
                <p className="font-glacial text-sm text-white/20 text-center max-w-xs">Découvrez nos créations et ajoutez vos favoris.</p>
                <Link to="/boutique" className="font-lastica text-[9px] tracking-[4px] px-6 py-3.5 mt-2" style={{ background: GOLD, color: '#050505' }}>
                    DÉCOUVRIR LA BOUTIQUE
                </Link>
            </div>
        </Layout>
    );

    return (
        <Layout title="Mon panier — MIA DREAMS">
            <div className="bg-[#050505] min-h-screen pt-28 pb-20 px-6 lg:px-10">
                <div className="max-w-5xl mx-auto">

                    <div className="mb-10">
                        <p className="font-lastica text-[7px] tracking-[5px] text-white/15 uppercase mb-1">Shopping</p>
                        <h1 className="font-glacial text-3xl text-white/80 uppercase tracking-[4px]">Mon Panier</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
                        {/* Articles */}
                        <div className="space-y-0">
                            <div className="border-b border-white/[0.05] pb-3 mb-2 hidden md:grid grid-cols-[1fr_120px_100px_40px] gap-4">
                                {['Produit', 'Prix', 'Quantité', ''].map(h => (
                                    <span key={h} className="font-lastica text-[6px] tracking-[3px] text-white/20 uppercase">{h}</span>
                                ))}
                            </div>

                            {items.map(item => (
                                <div key={item.key} className="py-5 border-b border-white/[0.05] grid grid-cols-1 md:grid-cols-[1fr_120px_100px_40px] gap-4 items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-20 flex-shrink-0 overflow-hidden" style={{ background: '#111' }}>
                                            {item.image
                                                ? <img src={`/uploads/${item.image}`} className="w-full h-full object-cover" alt={item.name} />
                                                : <div className="w-full h-full bg-white/5" />
                                            }
                                        </div>
                                        <div>
                                            <p className="font-glacial text-sm text-white/70 uppercase tracking-[1px]">{item.name}</p>
                                            {item.size && <p className="font-glacial text-xs text-white/25 mt-0.5">Taille : {item.size}</p>}
                                            {item.color && <p className="font-glacial text-xs text-white/25">Couleur : {item.color}</p>}
                                        </div>
                                    </div>

                                    <span className="font-glacial text-sm" style={{ color: GOLD }}>
                                        {item.price.toLocaleString('fr-FR')} FCFA
                                    </span>

                                    <div className="flex items-center gap-0 border border-white/10 w-fit">
                                        <button onClick={() => updateQty(item.key, item.quantity - 1)}
                                            className="w-9 h-9 text-white/40 hover:text-white transition-colors">−</button>
                                        <span className="w-9 text-center font-glacial text-sm text-white/60">{item.quantity}</span>
                                        <button onClick={() => updateQty(item.key, item.quantity + 1)}
                                            className="w-9 h-9 text-white/40 hover:text-white transition-colors">+</button>
                                    </div>

                                    <button onClick={() => removeItem(item.key)}
                                        className="text-white/20 hover:text-red-400/60 transition-colors w-9 h-9 flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            <div className="pt-5 flex justify-between items-center">
                                <Link to="/boutique" className="font-lastica text-[7px] tracking-[3px] text-white/20 hover:text-white/50 transition-colors uppercase">
                                    ← Continuer les achats
                                </Link>
                                <button onClick={clearCart} className="font-lastica text-[7px] tracking-[3px] text-white/15 hover:text-red-400/50 transition-colors uppercase">
                                    Vider le panier
                                </button>
                            </div>
                        </div>

                        {/* Récapitulatif */}
                        <div className="border border-white/[0.05] p-6 h-fit" style={{ background: '#0c0c0c' }}>
                            <div className="flex items-center gap-3 mb-6">
                                <p className="font-lastica text-[7px] tracking-[4px] text-white/20 uppercase">Récapitulatif</p>
                                <div className="flex-1 h-px bg-white/[0.04]" />
                            </div>

                            <div className="space-y-3 mb-5">
                                <div className="flex justify-between">
                                    <span className="font-glacial text-sm text-white/40">Sous-total</span>
                                    <span className="font-glacial text-sm text-white/70">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-glacial text-sm text-white/40">Livraison</span>
                                    <span className="font-glacial text-sm text-white/70">{shipping.toLocaleString('fr-FR')} FCFA</span>
                                </div>
                                <div className="h-px bg-white/[0.05]" />
                                <div className="flex justify-between">
                                    <span className="font-glacial text-sm text-white/70 font-medium">Total</span>
                                    <span className="font-glacial text-base font-medium" style={{ color: GOLD }}>
                                        {total.toLocaleString('fr-FR')} FCFA
                                    </span>
                                </div>
                            </div>

                            <Link to="/commande"
                                className="block w-full py-4 text-center font-lastica text-[9px] tracking-[4px] uppercase transition-all hover:brightness-110"
                                style={{ background: GOLD, color: '#050505' }}>
                                COMMANDER →
                            </Link>

                            {/* Modes de paiement acceptés */}
                            <div className="mt-5 pt-4 border-t border-white/[0.05]">
                                <p className="font-lastica text-[6px] tracking-[3px] text-white/15 uppercase mb-3 text-center">Paiement sécurisé</p>
                                <div className="flex justify-center gap-3 flex-wrap">
                                    {['Wave', 'Orange Money', 'Free Money'].map(m => (
                                        <span key={m} className="font-lastica text-[6px] tracking-[1px] px-2.5 py-1.5 border border-white/[0.06] text-white/25 rounded-sm">
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
