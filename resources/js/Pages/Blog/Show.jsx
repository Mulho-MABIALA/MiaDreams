import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

function SocialShare({ url, title }) {
    const encoded = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return (
        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-[#eee]">
            <span className="font-lastica text-[8px] tracking-[3px] text-[#999] uppercase">Partager</span>
            <a href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
               target="_blank" rel="noopener"
               className="flex items-center gap-1.5 font-glacial text-[10px] tracking-[2px] uppercase text-[#555] hover:text-[#25D366] transition-colors duration-200">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
               target="_blank" rel="noopener"
               className="flex items-center gap-1.5 font-glacial text-[10px] tracking-[2px] uppercase text-[#555] hover:text-[#1877F2] transition-colors duration-200">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
            </a>
            <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`}
               target="_blank" rel="noopener"
               className="flex items-center gap-1.5 font-glacial text-[10px] tracking-[2px] uppercase text-[#555] hover:text-[#1DA1F2] transition-colors duration-200">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X
            </a>
            <button onClick={() => {
                navigator.clipboard?.writeText(url);
            }}
                    className="flex items-center gap-1.5 font-glacial text-[10px] tracking-[2px] uppercase text-[#555] hover:text-[#C4A267] transition-colors duration-200 ml-auto">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                Copier
            </button>
        </div>
    );
}

export default function BlogShow({ post, related }) {
    if (!post) return null;

    const imgSrc = post.cover_image ? `/storage/${post.cover_image}` : '/img/index/home-image7.webp';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <Layout>
            <Head title={post.title}>
                <meta name="description" content={post.excerpt || post.title} />
                <meta property="og:image" content={imgSrc} />
                <meta property="og:type" content="article" />
            </Head>

            {/* HERO */}
            <div className="relative h-[55vh] min-h-[420px] flex items-end overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                     style={{ backgroundImage: `url('${imgSrc}')`, filter: 'brightness(.3)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,.9) 0%,transparent 60%)' }} />
                <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 pb-12 w-full">
                    {post.category && (
                        <span className="inline-block font-lastica text-[8px] tracking-[3px] text-gold uppercase border border-gold/50 px-3 py-1 mb-4">
                            {post.category}
                        </span>
                    )}
                    <h1 className="font-glacial font-light text-white uppercase tracking-[4px] leading-tight"
                        style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', opacity: 0, animation: 'fadeUp .9s .3s forwards' }}>
                        {post.title}
                    </h1>
                    {post.published_at && (
                        <p className="font-glacial text-sm text-white/40 mt-3 tracking-[2px]">
                            {new Date(post.published_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    )}
                </div>
            </div>

            {/* CONTENU */}
            <article className="bg-white py-16">
                <div className="max-w-3xl mx-auto px-6 lg:px-10">
                    {post.excerpt && (
                        <p className="font-glacial text-lg text-[#444] leading-relaxed mb-8 border-l-2 border-gold pl-5 italic">
                            {post.excerpt}
                        </p>
                    )}
                    {post.content && (
                        <div className="font-glacial text-sm text-[#555] leading-loose prose prose-sm max-w-none"
                             dangerouslySetInnerHTML={{ __html: post.content }} />
                    )}

                    <SocialShare url={pageUrl} title={post.title} />
                </div>
            </article>

            {/* ARTICLES LIÉS */}
            {related && related.length > 0 && (
                <section className="bg-[#faf9f7] py-16">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="text-center mb-10">
                            <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-2">À lire aussi</span>
                            <h3 className="font-glacial text-2xl font-light text-[#1a1a1a] uppercase tracking-[3px]">
                                ARTICLES <span className="text-gold">SIMILAIRES</span>
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {related.map(r => (
                                <Link key={r.id} href={`/blog/${r.slug}`} className="group">
                                    <div className="overflow-hidden mb-3">
                                        <img src={r.cover_image ? `/storage/${r.cover_image}` : '/img/index/home-image7.webp'}
                                             className="w-full h-[180px] object-cover transition-transform duration-500 group-hover:scale-105"
                                             style={{ filter: 'brightness(.85)' }} alt={r.title} loading="lazy" />
                                    </div>
                                    <h4 className="font-glacial text-sm text-[#1a1a1a] uppercase tracking-[2px] group-hover:text-gold transition-colors duration-200">
                                        {r.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* RETOUR */}
            <div className="bg-[#0d0d0d] py-10 text-center">
                <Link href="/blog"
                      className="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold border border-gold/50 px-10 py-4 hover:bg-gold hover:text-[#0d0d0d] hover:border-gold transition-all duration-300">
                    ← RETOUR AU BLOG
                </Link>
            </div>
        </Layout>
    );
}
