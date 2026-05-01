import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

const ERROR_DATA = {
    403: {
        title: 'Accès refusé',
        label: 'Erreur 403',
        heading: ['ACCÈS', 'REFUSÉ'],
        desc: "Vous n'avez pas l'autorisation d'accéder à cette page.",
    },
    500: {
        title: 'Erreur serveur',
        label: 'Erreur 500',
        heading: ['ERREUR', 'SERVEUR'],
        desc: 'Une erreur interne s\'est produite. Nous travaillons à la résoudre.',
    },
    503: {
        title: 'Maintenance',
        label: 'Erreur 503',
        heading: ['EN', 'MAINTENANCE'],
        desc: 'Le site est temporairement en maintenance. Revenez dans quelques instants.',
    },
};

export default function ServerError({ status = 500, message }) {
    const err = ERROR_DATA[status] || ERROR_DATA[500];

    return (
        <Layout hideNewsletter>
            <Head title={err.title} />

            <div className="bg-[#0d0d0d] min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
                 style={{ paddingTop: 0 }}>
                {/* Fond décoratif */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full"
                         style={{ background: 'radial-gradient(circle,rgba(196,162,103,.05),transparent 70%)' }} />
                </div>

                {/* Logo */}
                <div style={{ opacity: 0, animation: 'fadeUp .7s .1s forwards' }}>
                    <Link href="/">
                        <img src="/img/logo_MIA.png" alt="MIA DREAMS"
                             className="h-9 w-auto brightness-0 invert opacity-40 mx-auto mb-16 hover:opacity-70 transition-opacity duration-300" />
                    </Link>
                </div>

                {/* Grand code flottant */}
                <div className="relative" style={{ opacity: 0, animation: 'fadeUp .8s .2s forwards' }}>
                    <span className="font-glacial font-light select-none block leading-none"
                          style={{ fontSize: 'clamp(7rem,22vw,16rem)', color: 'rgba(196,162,103,0.07)', letterSpacing: '-4px' }}>
                        {status}
                    </span>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-10 h-px bg-gold mb-5" />
                        <span className="font-lastica text-[9px] tracking-[6px] text-gold uppercase mb-4">{err.label}</span>
                        <h1 className="font-glacial font-light text-white uppercase tracking-[4px]"
                            style={{ fontSize: 'clamp(1.4rem,3.5vw,2.4rem)' }}>
                            {err.heading[0]} <span className="text-gold">{err.heading[1]}</span>
                        </h1>
                    </div>
                </div>

                <p className="font-glacial text-sm text-white/40 leading-relaxed max-w-sm mx-auto mt-6 mb-10"
                   style={{ opacity: 0, animation: 'fadeUp .8s .45s forwards' }}>
                    {message || err.desc}
                </p>

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
            </div>
        </Layout>
    );
}
