import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function NotFound() {
    return (
        <Layout>
            <Head title="Page introuvable" />

            <div className="bg-[#0d0d0d] min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden" style={{ paddingTop: 0 }}>
                {/* Fond décoratif */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full"
                         style={{ background: 'radial-gradient(circle,rgba(196,162,103,.06),transparent 70%)' }} />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
                         style={{ background: 'radial-gradient(circle,rgba(196,162,103,.04),transparent 70%)' }} />
                </div>

                {/* Logo */}
                <div style={{ opacity: 0, animation: 'fadeUp .7s .1s forwards' }}>
                    <Link href="/">
                        <img src="/img/logo_MIA.png" alt="MIA DREAMS"
                             className="h-9 w-auto brightness-0 invert opacity-50 mx-auto mb-16 hover:opacity-80 transition-opacity duration-300" />
                    </Link>
                </div>

                {/* Grand 404 flottant */}
                <div className="relative" style={{ opacity: 0, animation: 'fadeUp .8s .2s forwards' }}>
                    <span className="font-glacial font-light select-none block leading-none"
                          style={{ fontSize: 'clamp(7rem,22vw,16rem)', color: 'rgba(196,162,103,0.07)', animation: 'float 7s ease-in-out infinite', letterSpacing: '-4px' }}>
                        404
                    </span>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-10 h-px bg-gold mb-5" />
                        <span className="font-lastica text-[9px] tracking-[6px] text-gold uppercase mb-4">Erreur 404</span>
                        <h1 className="font-glacial font-light text-white uppercase tracking-[4px]"
                            style={{ fontSize: 'clamp(1.4rem,3.5vw,2.4rem)' }}>
                            PAGE <span className="text-gold">INTROUVABLE</span>
                        </h1>
                    </div>
                </div>

                {/* Description */}
                <p className="font-glacial text-sm text-white/40 leading-relaxed max-w-sm mx-auto mt-6 mb-10"
                   style={{ opacity: 0, animation: 'fadeUp .8s .45s forwards' }}>
                    La page que vous cherchez a peut-être été déplacée, supprimée ou n'a jamais existé.
                </p>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center"
                     style={{ opacity: 0, animation: 'fadeUp .8s .6s forwards' }}>
                    <Link href="/"
                          className="font-glacial text-[11px] tracking-[4px] uppercase bg-gold text-[#0d0d0d] px-10 py-4 hover:bg-[#d4b97a] transition-all duration-300">
                        ← RETOUR À L'ACCUEIL
                    </Link>
                    <Link href="/contact"
                          className="font-glacial text-[11px] tracking-[4px] uppercase text-gold border border-gold/50 px-10 py-4 hover:bg-gold hover:text-[#0d0d0d] hover:border-gold transition-all duration-300">
                        NOUS CONTACTER
                    </Link>
                </div>

                {/* Liens rapides */}
                <div className="mt-14 pt-8 border-t border-white/[0.06] w-full max-w-lg"
                     style={{ opacity: 0, animation: 'fadeUp .8s .75s forwards' }}>
                    <span className="block font-lastica text-[8px] tracking-[4px] text-white/20 uppercase mb-5">Explorez</span>
                    <div className="flex flex-wrap gap-x-7 gap-y-3 justify-center">
                        {[
                            ['/miaDreams', 'Mia Dreams'],
                            ['/galerie', 'Galerie'],
                            ['/catalogues', 'Catalogues'],
                            ['/impact', 'Notre Impact'],
                            ['/apropos', 'À Propos'],
                            ['/blog', 'Blog'],
                        ].map(([href, label]) => (
                            <Link key={href} href={href}
                                  className="font-glacial text-[11px] tracking-[2px] uppercase text-white/25 hover:text-gold transition-colors duration-250">
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
