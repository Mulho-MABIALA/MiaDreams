import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const DEFAULT_SERVICES = ['Coaching', 'Personal Branding', 'Fashion Program', 'Confection', 'Consulting', 'Autre'];

export default function Reservation() {
    const [services, setServices] = useState(DEFAULT_SERVICES);
    const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', preferred_date: '', preferred_time: '', message: '' });
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get('/api/reservation/services').then(res => setServices(res.data)).catch(() => {});
    }, []);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true); setErrors({}); setSuccess('');
        try {
            const res = await axios.post('/api/reservation', form);
            setSuccess(res.data.success);
            setForm({ name: '', email: '', phone: '', service: '', preferred_date: '', preferred_time: '', message: '' });
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Layout title="Réservation">
            {/* HERO */}
            <div className="relative h-[40vh] min-h-[280px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/index/home-image5.jpg')", filter: 'brightness(.2)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(8,8,8,.4) 0%,rgba(8,8,8,.97) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Prendre rendez-vous</span>
                    <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        RÉSERVATION
                    </h1>
                </div>
            </div>

            <section className="bg-[#0d0d0d] py-20">
                <div className="max-w-3xl mx-auto px-6 lg:px-10">
                    {success && (
                        <div className="mb-8 border border-gold/30 bg-gold/10 px-6 py-5">
                            <p className="font-glacial text-sm text-gold tracking-wide">{success}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6 reveal">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="input-label">Nom complet *</label>
                                <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Votre nom" className="input-mia" required />
                                {errors.name && <p className="text-red-400 text-xs mt-1 font-glacial">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="input-label">Email *</label>
                                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="votre@email.com" className="input-mia" required />
                                {errors.email && <p className="text-red-400 text-xs mt-1 font-glacial">{errors.email}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="input-label">Téléphone</label>
                                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+221 XX XXX XX XX" className="input-mia" />
                            </div>
                            <div>
                                <label className="input-label">Service souhaité *</label>
                                <select value={form.service} onChange={e => set('service', e.target.value)} required
                                        className="input-mia bg-transparent appearance-none cursor-pointer">
                                    <option value="">Choisir un service…</option>
                                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {errors.service && <p className="text-red-400 text-xs mt-1 font-glacial">{errors.service}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="input-label">Date souhaitée</label>
                                <input type="date" value={form.preferred_date} onChange={e => set('preferred_date', e.target.value)} className="input-mia" />
                            </div>
                            <div>
                                <label className="input-label">Heure souhaitée</label>
                                <input type="time" value={form.preferred_time} onChange={e => set('preferred_time', e.target.value)} className="input-mia" />
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Message / Précisions</label>
                            <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={5} placeholder="Décrivez votre projet ou vos besoins…" className="input-mia resize-none" />
                        </div>
                        <button type="submit" disabled={processing}
                                className="btn btn-gold w-full justify-center disabled:opacity-40">
                            {processing ? 'ENVOI…' : 'ENVOYER MA DEMANDE'}
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    );
}
