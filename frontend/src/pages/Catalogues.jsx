import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import CatalogueGrid from '../components/CatalogueGrid';
import { useLanguage } from '../context/LanguageContext';

export default function Catalogues() {
    const { t } = useLanguage();
    const [catalogues, setCatalogues] = useState([]);

    useEffect(() => {
        axios.get('/api/catalogues', { params: { _t: Date.now() } })
            .then(res => setCatalogues(res.data)).catch(() => {});
    }, []);

    return (
        <Layout title="Catalogues">
            {/* HERO */}
            <div className="relative h-[38vh] min-h-[260px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/index/home-image2.jpg')", filter: 'brightness(.18)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(8,8,8,.4) 0%,rgba(8,8,8,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>{t('catalogues_eyebrow')}</span>
                    <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        {t('catalogues_title').split(' ').slice(0,1).join(' ')} <span className="text-gold">{t('catalogues_title').split(' ').slice(1).join(' ')}</span>
                    </h1>
                </div>
            </div>

            <section className="bg-[#080808] py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <CatalogueGrid catalogues={catalogues} emptyText={t('catalogues_empty')} />
                </div>
            </section>

        </Layout>
    );
}
