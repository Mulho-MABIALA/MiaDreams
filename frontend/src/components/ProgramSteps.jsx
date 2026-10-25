import { Link } from 'react-router-dom';

/**
 * ProgramSteps — section « programme / modules » en cartes numérotées
 * (filigrane doré, barre qui se déploie au survol, badge qui se remplit).
 * Utilisée par les pages formation (Programmes/Detail) et marques
 * (Personal Branding, Fashion Program).
 *
 * Props :
 *   eyebrow  : petit libellé au-dessus du titre
 *   title    : titre (node — permet de colorer une partie en or)
 *   intro    : phrase d'introduction (optionnelle)
 *   stats    : node affiché sous l'intro (chiffres clés, optionnel)
 *   items    : [{ title, description }]
 *   label    : mot devant le numéro (« Module », « Étape »…)
 *   columns  : 3 (défaut) ou 4 colonnes sur grand écran
 *   cta      : { title, text, href, label } — bandeau d'appel à l'action (optionnel)
 */
export default function ProgramSteps({ eyebrow, title, intro, stats, items = [], label = 'Étape', columns = 3, cta }) {
    if (!items.length) return null;
    const n = items.length;
    const lgCols = columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

    return (
        <section className="bg-texture py-24 lg:py-32 relative overflow-hidden">
            {/* Halo doré d'ambiance */}
            <div className="absolute pointer-events-none" style={{ top: '-15%', left: '50%', width: 900, height: 900, transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(196,162,103,0.10) 0%, transparent 60%)' }} />

            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
                <div className="text-center mb-14 reveal">
                    {eyebrow && <span className="eyebrow justify-center">{eyebrow}</span>}
                    <h2 className="display-title text-3xl lg:text-5xl text-white mt-4 mb-5">{title}</h2>
                    <div className="gold-line-center" />
                    {intro && (
                        <p className="font-glacial text-sm sm:text-base text-white/60 leading-relaxed max-w-xl mx-auto mt-6">{intro}</p>
                    )}
                    {stats && <div className="flex flex-wrap justify-center gap-3 mt-8">{stats}</div>}
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 ${lgCols} gap-5 lg:gap-6`}>
                    {items.map((m, i) => {
                        const num = String(i + 1).padStart(2, '0');
                        return (
                            <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                                <article className="group relative h-full overflow-hidden border border-gold/15 p-8 lg:p-9 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[0_20px_60px_-20px_rgba(196,162,103,0.35)]"
                                         style={{ background: 'linear-gradient(160deg, #151310 0%, #0c0c0c 55%)' }}>
                                    {/* Barre dorée qui se déploie au survol */}
                                    <span className="absolute top-0 left-0 h-[3px] w-full origin-left scale-x-[0.18] group-hover:scale-x-100 transition-transform duration-700"
                                          style={{ background: 'linear-gradient(90deg, #C4A267, #E8D3A0, #C4A267)' }} />
                                    {/* Grand numéro en filigrane */}
                                    <span aria-hidden="true"
                                          className="absolute -right-2 -bottom-6 font-lastica leading-none select-none pointer-events-none transition-all duration-700 group-hover:-translate-y-2 opacity-60 group-hover:opacity-100"
                                          style={{ fontSize: columns === 4 ? '6.5rem' : '8rem', color: 'transparent', WebkitTextStroke: '1px rgba(196,162,103,0.28)' }}>
                                        {num}
                                    </span>

                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="w-10 h-10 flex items-center justify-center border border-gold/40 text-gold font-lastica text-[11px] tracking-[1px] group-hover:bg-gold group-hover:text-[#0c0c0c] transition-colors duration-500">
                                                {num}
                                            </span>
                                            <span className="font-lastica text-[9px] tracking-[3px] text-gold/70 uppercase">
                                                {label} {i + 1}/{n}
                                            </span>
                                        </div>
                                        <h3 className="font-glacial text-lg text-white uppercase tracking-[2px] leading-snug mb-4 group-hover:text-gold transition-colors duration-500">
                                            {m.title}
                                        </h3>
                                        {m.description && (
                                            <p className="font-glacial text-sm text-white/65 leading-relaxed">{m.description}</p>
                                        )}
                                    </div>
                                </article>
                            </div>
                        );
                    })}
                </div>

                {/* Appel à l'action sous le programme */}
                {cta && (
                    <div className="reveal mt-14 border border-gold/25 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
                         style={{ background: 'linear-gradient(90deg, rgba(196,162,103,0.12) 0%, rgba(196,162,103,0.02) 100%)' }}>
                        <div>
                            <h3 className="display-title text-xl lg:text-2xl text-white">{cta.title}</h3>
                            {cta.text && <p className="font-glacial text-sm text-white/60 mt-2">{cta.text}</p>}
                        </div>
                        {cta.href.startsWith('#')
                            ? <a href={cta.href} className="btn btn-gold flex-shrink-0">{cta.label}</a>
                            : <Link to={cta.href} className="btn btn-gold flex-shrink-0">{cta.label}</Link>}
                    </div>
                )}
            </div>
        </section>
    );
}

/** Petite étiquette de chiffre clé (ex. « 6 modules », « 3 mois »). */
export function StatPill({ icon, strong, label }) {
    return (
        <span className="inline-flex items-center gap-2 border border-gold/25 bg-white/[0.03] px-4 py-2 font-glacial text-xs tracking-[1.5px] uppercase text-white/75">
            {icon && <span className="text-gold">{icon}</span>}
            {strong !== undefined && <span className="font-lastica text-gold text-sm">{strong}</span>}
            {label}
        </span>
    );
}
