import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

export default function BlogShow() {
    const { slug } = useParams();
    const [data, setData] = useState({ post: null, related: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/blog/${slug}`)
            .then(res => { setData(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [slug]);

    if (loading) return (
        <Layout>
            <div className="min-h-screen bg-[#080808] flex items-center justify-center">
                <div className="w-8 h-px bg-gold animate-pulse" />
            </div>
        </Layout>
    );

    if (!data.post) return (
        <Layout title="Article introuvable">
            <div className="min-h-screen bg-[#080808] flex items-center justify-center text-center px-6">
                <div>
                    <p className="font-glacial text-gold text-sm tracking-[4px] uppercase mb-4">Article introuvable</p>
                    <Link to="/blog" className="btn btn-gold">RETOUR AU BLOG</Link>
                </div>
            </div>
        </Layout>
    );

    const { post, related } = data;
    const imgSrc = post.cover_image ? `/uploads/${post.cover_image}` : '/img/index/home-image7.webp';

    return (
        <Layout title={post.title}>
            {/* HERO */}
            <div className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
                <img src={imgSrc} className="absolute inset-0 w-full h-full object-cover object-top" style={{ filter: 'brightness(.35)' }} alt={post.title} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(8,8,8,1) 0%,rgba(8,8,8,.4) 60%,transparent 100%)' }} />
                <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 pb-12 w-full">
                    {post.category && <span className="inline-block font-lastica text-[8px] tracking-[3px] text-gold uppercase border border-gold/40 px-3 py-1 mb-5">{post.category}</span>}
                    <h1 className="display-title text-2xl lg:text-4xl text-white leading-tight mb-4">{post.title}</h1>
                    <div className="flex items-center gap-5 text-white/30">
                        {post.author && <span className="font-glacial text-xs">{post.author}</span>}
                        {post.published_at && <span className="font-glacial text-xs">{fmtDate(post.published_at)}</span>}
                        {post.reading_time && <span className="font-glacial text-xs">{post.reading_time} min de lecture</span>}
                    </div>
                </div>
            </div>

            {/* CONTENU */}
            <section className="bg-[#080808] py-16">
                <div className="max-w-3xl mx-auto px-6 lg:px-10">
                    {post.excerpt && (
                        <p className="font-glacial text-lg text-white/60 leading-relaxed mb-10 border-l-2 border-gold pl-6 italic">{post.excerpt}</p>
                    )}
                    {post.content && (
                        <div className="font-glacial text-sm text-white/60 leading-loose prose-invert"
                             style={{ lineHeight: '2' }}
                             dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
                    )}

                    {/* Partage */}
                    <div className="mt-14 pt-8 border-t border-gold/10 flex items-center gap-6 flex-wrap">
                        <span className="font-lastica text-[7px] tracking-[4px] text-gold/40 uppercase">Partager</span>
                        {[
                            { label: 'Facebook', url: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
                            { label: 'Twitter', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}` },
                            { label: 'LinkedIn', url: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
                        ].map(s => (
                            <a key={s.label} href={s.url} target="_blank" rel="noopener"
                               className="font-glacial text-[10px] tracking-[2px] uppercase text-white/30 hover:text-gold border border-white/10 hover:border-gold/40 px-4 py-2 transition-all duration-200">
                                {s.label}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ARTICLES LIÉS */}
            {related.length > 0 && (
                <section className="bg-[#0a0a0a] py-20 border-t border-gold/8">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="flex items-center gap-5 mb-12">
                            <span className="eyebrow">Continuer la lecture</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {related.map((p, i) => (
                                <Link key={p._id} to={`/blog/${p.slug}`} className="group reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                                    <div className="overflow-hidden mb-4">
                                        <img src={p.cover_image ? `/uploads/${p.cover_image}` : '/img/index/home-image7.webp'}
                                             className="w-full h-[200px] object-cover transition-transform duration-700 group-hover:scale-105"
                                             style={{ filter: 'brightness(.7)' }} alt={p.title} loading="lazy" />
                                    </div>
                                    {p.category && <span className="font-lastica text-[7px] tracking-[3px] text-gold uppercase mb-2 block">{p.category}</span>}
                                    <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] leading-tight group-hover:text-gold transition-colors">{p.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <div className="bg-[#080808] py-10 text-center border-t border-gold/8">
                <Link to="/blog" className="btn btn-gold">← RETOUR AU BLOG</Link>
            </div>
        </Layout>
    );
}
