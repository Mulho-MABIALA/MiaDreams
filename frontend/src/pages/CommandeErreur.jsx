import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';

const GOLD = '#C9A84C';

export default function CommandeErreur() {
    const { id } = useParams();
    const { t } = useLanguage();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (id) {
            axios.get(`/api/orders/public/${id}`)
                .then(r => setOrder(r.data))
                .catch(() => {});
        }
    }, [id]);

    return (
        <Layout title="Paiement échoué — MIA DREAMS">
            <div className="bg-[#050505] min-h-screen flex items-center justify-center px-6 pt-24 pb-20">
                <div className="max-w-md w-full text-center">

                    {/* Icône erreur */}
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20"
                         style={{ background: 'rgba(239,68,68,0.07)' }}>
                        <svg className="w-9 h-9 text-red-400/70" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </div>

                    <p className="font-lastica text-[7px] tracking-[5px] text-white/20 uppercase mb-3">{t('error_label')}</p>
                    <h1 className="font-glacial text-3xl text-white/80 uppercase tracking-[3px] mb-4">
                        {t('error_title').split(' ').slice(0,1).join(' ')} <span className="text-red-400/70">{t('error_title').split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="font-glacial text-sm text-white/40 leading-relaxed mb-3">
                        {t('error_msg')}
                    </p>

                    {order && (
                        <div className="border border-white/[0.05] p-4 mb-8 text-left" style={{ background: '#0c0c0c' }}>
                            <p className="font-lastica text-[7px] tracking-[3px] text-white/20 uppercase mb-3">{t('error_order')}</p>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-glacial text-sm text-white/40">{t('error_number')}</span>
                                <span className="font-lastica text-[9px] tracking-[2px]" style={{ color: GOLD }}>{order.order_number}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-glacial text-sm text-white/40">{t('error_total')}</span>
                                <span className="font-glacial text-sm" style={{ color: GOLD }}>{order.total?.toLocaleString('fr-FR')} FCFA</span>
                            </div>
                        </div>
                    )}

                    {/* Raisons possibles */}
                    <div className="border border-white/[0.04] p-5 mb-8 text-left" style={{ background: '#080808' }}>
                        <p className="font-lastica text-[7px] tracking-[3px] text-white/20 uppercase mb-4">{t('error_causes')}</p>
                        {[
                            t('error_cause1'),
                            t('error_cause2'),
                            t('error_cause3'),
                            t('error_cause4'),
                        ].map((r, i) => (
                            <div key={i} className="flex items-center gap-3 mb-2.5">
                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(239,68,68,0.4)' }} />
                                <p className="font-glacial text-sm text-white/35">{r}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col gap-3">
                        <Link to="/commande"
                            className="w-full py-4 font-lastica text-[9px] tracking-[4px] uppercase text-center transition-all hover:brightness-110"
                            style={{ background: GOLD, color: '#050505' }}>
                            {t('error_retry')}
                        </Link>
                        <Link to="/boutique"
                            className="w-full py-3.5 font-lastica text-[9px] tracking-[4px] uppercase text-center border transition-all"
                            style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}>
                            {t('error_back_shop')}
                        </Link>
                        <p className="font-glacial text-xs text-white/20 mt-2">
                            {t('error_whatsapp')}
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
