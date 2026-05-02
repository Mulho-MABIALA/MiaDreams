import { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import Layout from '../Components/Layout';

const TIMES = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'];

export default function Reservation({ services = {}, selectedService = '' }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name:           '',
        email:          '',
        phone:          '',
        service:        selectedService || '',
        preferred_date: '',
        preferred_time: '',
        message:        '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/reservation', {
            onSuccess: () => reset(),
        });
    };

    const servicesList = Object.entries(services);

    return (
        <Layout hideNewsletter>
            <Head title="Réserver une prestation">
                <meta name="description" content="Réservez une prestation MIA DREAMS & CO — coaching, personal branding, fashion program, confection sur mesure." />
            </Head>

            {/* HERO */}
            <div className="relative h-[42vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                     style={{ backgroundImage: "url('/img/index/home-image5.jpg')", filter: 'brightness(.2)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(13,13,13,.5) 0%,rgba(13,13,13,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="block font-lastica text-[10px] tracking-[6px] text-gold uppercase mb-5"
                          style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>
                        Prise de rendez-vous
                    </span>
                    <h1 className="font-glacial font-light text-white uppercase tracking-[6px] mb-5"
                        style={{ fontSize: 'clamp(2rem,5vw,4rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        RÉSERVEZ VOTRE <span className="text-gold">PRESTATION</span>
                    </h1>
                    <div className="w-12 h-px bg-gold mx-auto" style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }} />
                </div>
            </div>

            <section className="bg-[#0d0d0d] py-20">
                <div className="max-w-5xl mx-auto px-6 lg:px-10">

                    {/* Succès */}
                    {flash?.success && (
                        <div className="border border-gold/30 bg-gold/5 px-6 py-5 mb-10 flex items-start gap-4">
                            <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"/>
                            </svg>
                            <p className="font-glacial text-sm text-white/80">{flash.success}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Info colonne */}
                        <div className="reveal">
                            <div className="w-8 h-px bg-gold mb-5" />
                            <h2 className="font-glacial font-light text-white uppercase tracking-[3px] text-2xl mb-4">
                                NOS <span className="text-gold">PRESTATIONS</span>
                            </h2>
                            <p className="font-glacial text-sm text-white/45 leading-loose mb-8">
                                Choisissez la prestation qui vous correspond et indiquez vos disponibilités.
                                Nous vous confirmons le rendez-vous sous 24h.
                            </p>

                            <div className="flex flex-col gap-3">
                                {servicesList.map(([key, label]) => (
                                    <button key={key}
                                            onClick={() => setData('service', key)}
                                            className={`text-left px-4 py-3 border transition-all duration-200 font-glacial text-[11px] tracking-[2px] uppercase ${
                                                data.service === key
                                                    ? 'border-gold bg-gold/5 text-gold'
                                                    : 'border-white/10 text-white/50 hover:border-gold/30 hover:text-white/70'
                                            }`}>
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/[0.06]">
                                <p className="font-lastica text-[8px] tracking-[3px] text-gold/40 uppercase mb-3">Contact direct</p>
                                <p className="font-glacial text-sm text-white/40">
                                    Vous pouvez aussi nous joindre via WhatsApp ou par email.
                                </p>
                            </div>
                        </div>

                        {/* Formulaire */}
                        <div className="lg:col-span-2 reveal" style={{ transitionDelay: '.1s' }}>
                            <form onSubmit={submit} className="flex flex-col gap-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-2">Nom complet *</label>
                                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                               className="w-full bg-white/[0.04] border border-white/10 text-white font-glacial text-sm px-4 py-3 outline-none focus:border-gold/40 placeholder:text-white/20 transition-colors"
                                               placeholder="Votre nom" required />
                                        {errors.name && <p className="font-glacial text-xs text-red-400 mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-2">Email *</label>
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                               className="w-full bg-white/[0.04] border border-white/10 text-white font-glacial text-sm px-4 py-3 outline-none focus:border-gold/40 placeholder:text-white/20 transition-colors"
                                               placeholder="votre@email.com" required />
                                        {errors.email && <p className="font-glacial text-xs text-red-400 mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-2">Téléphone</label>
                                        <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)}
                                               className="w-full bg-white/[0.04] border border-white/10 text-white font-glacial text-sm px-4 py-3 outline-none focus:border-gold/40 placeholder:text-white/20 transition-colors"
                                               placeholder="+221 77 000 00 00" />
                                    </div>
                                    <div>
                                        <label className="block font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-2">Service *</label>
                                        <select value={data.service} onChange={e => setData('service', e.target.value)}
                                                className="w-full bg-[#1a1a1a] border border-white/10 text-white font-glacial text-sm px-4 py-3 outline-none focus:border-gold/40 transition-colors"
                                                required>
                                            <option value="">Choisir un service</option>
                                            {servicesList.map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                        {errors.service && <p className="font-glacial text-xs text-red-400 mt-1">{errors.service}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-2">Date souhaitée</label>
                                        <input type="date" value={data.preferred_date} onChange={e => setData('preferred_date', e.target.value)}
                                               className="w-full bg-white/[0.04] border border-white/10 text-white font-glacial text-sm px-4 py-3 outline-none focus:border-gold/40 transition-colors"
                                               min={new Date().toISOString().split('T')[0]} />
                                        {errors.preferred_date && <p className="font-glacial text-xs text-red-400 mt-1">{errors.preferred_date}</p>}
                                    </div>
                                    <div>
                                        <label className="block font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-2">Créneau horaire</label>
                                        <select value={data.preferred_time} onChange={e => setData('preferred_time', e.target.value)}
                                                className="w-full bg-[#1a1a1a] border border-white/10 text-white font-glacial text-sm px-4 py-3 outline-none focus:border-gold/40 transition-colors">
                                            <option value="">Indifférent</option>
                                            {TIMES.map(t => <option key={t} value={t}>{t.replace(':','h')}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-2">Message</label>
                                    <textarea value={data.message} onChange={e => setData('message', e.target.value)}
                                              rows={4}
                                              className="w-full bg-white/[0.04] border border-white/10 text-white font-glacial text-sm px-4 py-3 outline-none focus:border-gold/40 placeholder:text-white/20 transition-colors resize-none"
                                              placeholder="Décrivez brièvement votre projet ou vos attentes…" />
                                </div>

                                <button type="submit" disabled={processing}
                                        className="bg-gold text-[#0d0d0d] font-glacial text-[11px] tracking-[4px] uppercase py-4 px-10 hover:bg-[#d4b97a] transition-colors duration-300 disabled:opacity-50 self-start">
                                    {processing ? 'ENVOI EN COURS…' : 'ENVOYER MA DEMANDE →'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
