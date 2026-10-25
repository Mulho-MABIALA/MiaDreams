/**
 * Catalogues PDF rattachés à une marque (Admin → Catalogues → champ « Marque »),
 * téléchargeables depuis la page de la marque. N'affiche rien s'il n'y en a pas.
 * Usage : <BrandCatalogues brandSlug="personal-branding" />
 */
import { useEffect, useState } from 'react';
import axios from 'axios';
import CatalogueGrid from './CatalogueGrid';

export default function BrandCatalogues({ brandSlug }) {
    const [catalogues, setCatalogues] = useState([]);

    useEffect(() => {
        if (!brandSlug) return;
        axios.get('/api/catalogues', { params: { brand: brandSlug, _t: Date.now() } })
            // Double contrôle côté client : on ne garde que les catalogues dont la marque
            // correspond vraiment (si l'API ignore le filtre, on n'affiche pas tout).
            .then(res => setCatalogues((Array.isArray(res.data) ? res.data : []).filter(c => c.brand?.slug === brandSlug)))
            .catch(() => {});
    }, [brandSlug]);

    if (catalogues.length === 0) return null;

    return (
        <section className="bg-[#0a0a0a] py-20 lg:py-28 border-t border-gold/8">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Titre */}
                <div className="flex items-center gap-4 sm:gap-6 mb-10 sm:mb-14 reveal">
                    <div>
                        <span className="font-lastica text-[8px] tracking-[5px] text-gold/40 uppercase block mb-2">
                            À télécharger
                        </span>
                        <h2 className="display-title text-2xl lg:text-3xl text-white">
                            NOS <span className="text-gold">CATALOGUES</span>
                        </h2>
                    </div>
                    <div className="flex-1 h-px bg-gold/10" />
                    <span className="font-lastica text-[8px] tracking-[3px] text-white/45">
                        {catalogues.length} catalogue{catalogues.length > 1 ? 's' : ''}
                    </span>
                </div>

                <CatalogueGrid catalogues={catalogues} />
            </div>
        </section>
    );
}
