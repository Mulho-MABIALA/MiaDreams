import { Head } from '@inertiajs/react';
import { useForm, usePage } from '@inertiajs/react';
import Layout from '../Components/Layout';

export default function Contact() {
    const { companyInfo, flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact', { onSuccess: () => reset() });
    };

    const address = companyInfo?.address || '3 rue Bégenger Ferraud, CTIC DAKAR, Sénégal';
    const phone   = companyInfo?.phone   || '+221 76 463 91 69';
    const email   = companyInfo?.email   || 'contact@mia-dreams.com';

    return (
        <Layout>
            <Head title="Contact">
                <meta name="description" content="Contactez MIA DREAMS & CO — maison de mode africaine à Dakar. Commande, collaboration ou renseignement." />
            </Head>

            {/* HERO */}
            <div className="relative h-[40vh] min-h-[280px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                     style={{ backgroundImage: "url('/img/index/home-image1.jpg')", filter: 'brightness(.18)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(13,13,13,.5) 0%,rgba(13,13,13,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="block font-lastica text-[10px] tracking-[6px] text-gold uppercase mb-5"
                          style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Parlons-nous</span>
                    <h1 className="font-glacial font-light text-white uppercase tracking-[6px] mb-5"
                        style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        NOUS <span className="text-gold">CONTACTER</span>
                    </h1>
                    <div className="w-12 h-px bg-gold mx-auto" style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }} />
                </div>
            </div>

            <section className="bg-[#0d0d0d] py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* FORM */}
                        <div className="reveal">
                            <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Formulaire</span>
                            <h2 className="font-glacial text-3xl font-light text-white uppercase tracking-[3px] mb-8">
                                ENVOYEZ-NOUS <span className="text-gold">UN MESSAGE</span>
                            </h2>

                            {flash?.success && (
                                <div className="mb-6 border border-gold/30 bg-gold/10 px-5 py-4">
                                    <p className="font-glacial text-sm text-gold tracking-wide">{flash.success}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="VOTRE NOM *"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full bg-transparent border border-white/15 text-white placeholder-white/25 px-5 py-4 font-glacial text-sm tracking-wide outline-none focus:border-gold/50 transition-colors duration-300"
                                        />
                                        {errors.name && <p className="text-red-400 text-xs mt-1 font-glacial">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="VOTRE EMAIL *"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full bg-transparent border border-white/15 text-white placeholder-white/25 px-5 py-4 font-glacial text-sm tracking-wide outline-none focus:border-gold/50 transition-colors duration-300"
                                        />
                                        {errors.email && <p className="text-red-400 text-xs mt-1 font-glacial">{errors.email}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="TÉLÉPHONE"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            className="w-full bg-transparent border border-white/15 text-white placeholder-white/25 px-5 py-4 font-glacial text-sm tracking-wide outline-none focus:border-gold/50 transition-colors duration-300"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="SUJET *"
                                            value={data.subject}
                                            onChange={e => setData('subject', e.target.value)}
                                            className="w-full bg-transparent border border-white/15 text-white placeholder-white/25 px-5 py-4 font-glacial text-sm tracking-wide outline-none focus:border-gold/50 transition-colors duration-300"
                                        />
                                        {errors.subject && <p className="text-red-400 text-xs mt-1 font-glacial">{errors.subject}</p>}
                                    </div>
                                </div>
                                <div>
                                    <textarea
                                        rows={6}
                                        placeholder="VOTRE MESSAGE *"
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        className="w-full bg-transparent border border-white/15 text-white placeholder-white/25 px-5 py-4 font-glacial text-sm tracking-wide outline-none focus:border-gold/50 transition-colors duration-300 resize-none"
                                    />
                                    {errors.message && <p className="text-red-400 text-xs mt-1 font-glacial">{errors.message}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gold text-[#0d0d0d] font-glacial text-[11px] tracking-[4px] uppercase py-4 hover:bg-gold-light transition-colors duration-300 disabled:opacity-60 cursor-pointer"
                                >
                                    {processing ? 'ENVOI…' : 'ENVOYER LE MESSAGE'}
                                </button>
                            </form>
                        </div>

                        {/* INFOS */}
                        <div className="reveal" style={{ transitionDelay: '.15s' }}>
                            <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Coordonnées</span>
                            <h2 className="font-glacial text-3xl font-light text-white uppercase tracking-[3px] mb-8">
                                NOUS <span className="text-gold">TROUVER</span>
                            </h2>

                            <div className="space-y-6">
                                {/* Adresse */}
                                <div className="flex gap-5 items-start border border-gold/10 p-5 hover:border-gold/20 transition-colors duration-300">
                                    <div className="w-10 h-10 flex-shrink-0 bg-gold/10 border border-gold/30 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="block font-lastica text-[8px] tracking-[3px] text-gold/70 uppercase mb-2">Adresse</span>
                                        <span className="font-glacial text-sm text-white/70 leading-relaxed whitespace-pre-line">{address}</span>
                                    </div>
                                </div>
                                {/* Téléphone */}
                                <div className="flex gap-5 items-center border border-gold/10 p-5 hover:border-gold/20 transition-colors duration-300">
                                    <div className="w-10 h-10 flex-shrink-0 bg-gold/10 border border-gold/30 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="block font-lastica text-[8px] tracking-[3px] text-gold/70 uppercase mb-1">Téléphone</span>
                                        <a href={`tel:${phone.replace(/\s/g, '')}`}
                                           className="font-glacial text-sm text-white/70 hover:text-gold transition-colors duration-250">
                                            {phone}
                                        </a>
                                    </div>
                                </div>
                                {/* Email */}
                                <div className="flex gap-5 items-center border border-gold/10 p-5 hover:border-gold/20 transition-colors duration-300">
                                    <div className="w-10 h-10 flex-shrink-0 bg-gold/10 border border-gold/30 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="block font-lastica text-[8px] tracking-[3px] text-gold/70 uppercase mb-1">Email</span>
                                        <a href={`mailto:${email}`}
                                           className="font-glacial text-sm text-white/70 hover:text-gold transition-colors duration-250">
                                            {email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
