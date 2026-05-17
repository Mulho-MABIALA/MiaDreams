import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { imgSrc } from '../../utils/imgSrc';
import { inputCls } from '../../utils/formatters';
import Spinner from '../../components/Spinner';

// ─── Section Row (display) ───────────────────────────────────────────────────

function SectionRow({ section, onEdit, onDelete, onToggle }) {
    return (
        <div className={`flex items-center gap-4 px-4 py-3.5 border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-colors ${!section.is_active ? 'opacity-50' : ''}`}>
            {section.image && (
                <img src={imgSrc(section.image)} className="w-10 h-10 object-cover rounded-lg border border-[#E5E7EB] flex-shrink-0" alt="" />
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    {section.subtitle && (
                        <span className="text-xs font-semibold text-[#C9A84C] bg-[#FDF8EC] px-2 py-0.5 rounded-full">{section.subtitle}</span>
                    )}
                    {section.title && <span className="text-sm font-medium text-[#111827] truncate">{section.title}</span>}
                    {!section.title && section.content && (
                        <span className="text-sm text-[#6B7280] italic truncate">{section.content.slice(0, 80)}</span>
                    )}
                </div>
                {section.cta_label && (
                    <p className="text-xs text-[#9CA3AF] mt-0.5">CTA: {section.cta_label} → {section.cta_href}</p>
                )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => onToggle(section)} title={section.is_active ? 'Désactiver' : 'Activer'}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        section.is_active
                            ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-[#9CA3AF] bg-[#F3F4F6] hover:bg-[#E5E7EB]'
                    }`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {section.is_active
                            ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                            : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                        }
                    </svg>
                </button>
                <button onClick={() => onEdit(section)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] bg-[#F3F4F6] hover:bg-[#E5E7EB] hover:text-[#374151] transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button onClick={() => onDelete(section._id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                </button>
            </div>
        </div>
    );
}

// ─── Section Form (modal) ─────────────────────────────────────────────────────

const FIELDS_BY_TYPE = {
    hero_slide:        ['subtitle', 'title', 'content', 'cta_label', 'cta_href', 'image', 'order', 'is_active'],
    tagline:           ['content'],
    intro:             ['title', 'content', 'cta_label', 'cta_href', 'video_url'],
    univers:           ['subtitle', 'title', 'content', 'cta_href', 'image', 'order', 'is_active'],
    histoire:          ['subtitle', 'content', 'image'],
    stat:              ['subtitle', 'title'],
    valeur:            ['subtitle', 'title', 'content', 'order', 'is_active'],
    personal_branding: ['subtitle', 'title', 'content', 'cta_label', 'cta_href', 'image'],
    ethical_fashion:   ['subtitle', 'title', 'content', 'cta_label', 'cta_href', 'image'],
    blog_banner:       ['subtitle', 'title', 'content', 'cta_label', 'cta_href', 'image'],
    impact_mvv:        ['subtitle', 'content', 'order'],
    impact_stat:       ['subtitle', 'title', 'order'],
    impact_engagement: ['subtitle', 'title', 'content', 'order'],
};

const FIELD_LABELS = {
    subtitle:  'Sous-titre / N°',
    title:     'Titre',
    content:   'Contenu',
    cta_label: 'Bouton (label)',
    cta_href:  'Bouton (lien)',
    image:     'Image',
    video_url: 'URL Vidéo YouTube',
    order:     'Ordre',
    is_active: 'Actif',
};

function SectionForm({ section, type, page, onSave, onCancel }) {
    const fields = FIELDS_BY_TYPE[type] || ['title', 'content', 'image', 'order', 'is_active'];
    const [form, setForm] = useState(() => {
        const init = { title: '', subtitle: '', content: '', cta_label: '', cta_href: '', video_url: '', order: 0, is_active: true };
        if (section) Object.assign(init, section);
        return init;
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(section?.image ? imgSrc(section.image) : null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef();

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            fields.forEach(f => {
                if (f === 'image') return;
                if (f === 'is_active') fd.append('is_active', form.is_active ? 'true' : 'false');
                else fd.append(f, form[f] ?? '');
            });
            fd.append('page', page);
            fd.append('type', type);
            if (imageFile) fd.append('image', imageFile);

            if (section?._id) {
                const res = await axios.put(`/api/admin/sections/${section._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                onSave(res.data);
            } else {
                const res = await axios.post('/api/admin/sections', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                onSave(res.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5E7EB]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                    <div>
                        <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Section</p>
                        <h3 className="text-base font-semibold text-[#111827]">
                            {section ? 'Modifier' : 'Ajouter'} — <span className="text-[#C9A84C]">{type}</span>
                        </h3>
                    </div>
                    <button onClick={onCancel} className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {fields.includes('image') && (
                        <div>
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">Image</label>
                            <div className="flex items-center gap-3">
                                {imagePreview && <img src={imagePreview} className="w-16 h-16 object-cover rounded-lg border border-[#E5E7EB]" alt="" />}
                                <button type="button" onClick={() => fileRef.current?.click()}
                                    className="text-sm font-medium text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB] px-4 py-2 rounded-lg transition-colors">
                                    {imagePreview ? 'Changer' : 'Choisir une image'}
                                </button>
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                            </div>
                        </div>
                    )}
                    {fields.includes('subtitle') && (
                        <div>
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">{FIELD_LABELS.subtitle}</label>
                            <input type="text" value={form.subtitle} onChange={e => set('subtitle', e.target.value)}
                                placeholder={type === 'stat' ? 'ex: 5+' : 'ex: 01'} className={inputCls} />
                        </div>
                    )}
                    {fields.includes('title') && (
                        <div>
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">{FIELD_LABELS.title}</label>
                            <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                                placeholder={type === 'stat' ? "Années d'expérience" : 'Titre de la section'} className={inputCls} />
                        </div>
                    )}
                    {fields.includes('content') && (
                        <div>
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">
                                {FIELD_LABELS.content}
                                {type === 'histoire' && <span className="ml-2 text-[#9CA3AF] font-normal">(séparer les paragraphes par une ligne vide)</span>}
                            </label>
                            <textarea value={form.content} onChange={e => set('content', e.target.value)}
                                rows={type === 'histoire' ? 6 : type === 'intro' ? 5 : 3}
                                placeholder="Contenu…" className={inputCls + " resize-y"} />
                        </div>
                    )}
                    {fields.includes('cta_label') && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-[#374151] mb-1.5">{FIELD_LABELS.cta_label}</label>
                                <input type="text" value={form.cta_label} onChange={e => set('cta_label', e.target.value)}
                                    placeholder="DÉCOUVRIR" className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#374151] mb-1.5">{FIELD_LABELS.cta_href}</label>
                                <input type="text" value={form.cta_href} onChange={e => set('cta_href', e.target.value)}
                                    placeholder="/miaDreams" className={inputCls} />
                            </div>
                        </div>
                    )}
                    {fields.includes('video_url') && (
                        <div>
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">{FIELD_LABELS.video_url}</label>
                            <input type="text" value={form.video_url} onChange={e => set('video_url', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=... ou /embed/..." className={inputCls} />
                            <p className="text-[10px] text-[#9CA3AF] mt-1">Collez l'URL YouTube normale ou l'URL d'embed — les deux formats sont acceptés.</p>
                            {form.video_url && (
                                <div className="mt-2 relative w-full rounded-lg overflow-hidden border border-[#E5E7EB]" style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={form.video_url.includes('embed/') ? form.video_url : (() => { const m = form.video_url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/); return m ? `https://www.youtube.com/embed/${m[1]}` : form.video_url; })()}
                                        frameBorder="0" allowFullScreen title="Aperçu vidéo" />
                                </div>
                            )}
                        </div>
                    )}
                    {fields.includes('order') && (
                        <div>
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">{FIELD_LABELS.order}</label>
                            <input type="number" value={form.order} onChange={e => set('order', Number(e.target.value))}
                                className={inputCls + " w-28"} />
                        </div>
                    )}
                    {fields.includes('is_active') && (
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                            <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)}
                                className="w-4 h-4 accent-[#C9A84C] rounded" />
                            <span className="text-sm text-[#374151]">Actif (visible sur le site)</span>
                        </label>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#F3F4F6]">
                        <button type="button" onClick={onCancel}
                            className="border border-[#E5E7EB] text-[#374151] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                            Annuler
                        </button>
                        <button type="submit" disabled={saving}
                            className="bg-[#C9A84C] hover:bg-[#B8973B] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm">
                            {saving && <Spinner />}
                            {saving ? 'Enregistrement…' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Section Group ────────────────────────────────────────────────────────────

const TYPE_LABELS = {
    hero_slide:        { label: 'Slides Hero',               desc: 'Diaporama principal (image, titre, CTA)',                    icon: '🖼' },
    tagline:           { label: 'Tagline',                   desc: "Bande dorée sous l'intro",                                  icon: '✦' },
    intro:             { label: 'Intro',                     desc: 'Section avec vidéo (citation + paragraphe)',                icon: '💬' },
    univers:           { label: 'Nos Univers',               desc: 'Cartes des univers (Mia Dreams Brand, MPREW…)',             icon: '🌍' },
    personal_branding: { label: 'Personal Branding',        desc: 'Section offre Personal Branding (texte + image droite)',    icon: '👤' },
    ethical_fashion:   { label: 'Ethical Fashion',          desc: 'Section engagement éthique (texte + image gauche)',         icon: '🌿' },
    blog_banner:       { label: 'Blog & Podcast',           desc: 'Bannière Blog/Podcast (fond image + titre + CTA)',          icon: '📝' },
    histoire:          { label: 'Notre Histoire',            desc: 'Texte + image + sous-titre de la section Histoire',        icon: '📖' },
    stat:              { label: 'Statistiques (À Propos)',   desc: 'Chiffres clés (5+ Années, 4 Marques…)',                    icon: '📊' },
    valeur:            { label: 'Nos Valeurs',               desc: 'Cartes des valeurs (Authenticité, Excellence…)',           icon: '⭐' },
    impact_mvv:        { label: 'Mission / Vision / Valeurs', desc: 'Les 3 cartes Mission, Vision, Valeurs',                  icon: '🎯' },
    impact_stat:       { label: 'Statistiques (Impact)',     desc: 'Chiffres clés — subtitle = chiffre, title = libellé',     icon: '📈' },
    impact_engagement: { label: 'Nos Engagements',          desc: "Les 4 blocs d'engagement",                                 icon: '🤝' },
};

const SINGLE_TYPES = ['tagline', 'intro', 'histoire', 'personal_branding', 'ethical_fashion', 'blog_banner'];

function SectionGroup({ type, page }) {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [open, setOpen] = useState(false);

    const load = () => {
        setLoading(true);
        axios.get('/api/admin/sections-page', { params: { page, type } })
            .then(r => setSections(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { if (open) load(); }, [open, type, page]);

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette section ?')) return;
        await axios.delete(`/api/admin/sections/${id}`);
        setSections(s => s.filter(x => x._id !== id));
    };

    const handleToggle = async (section) => {
        const res = await axios.put(`/api/admin/sections/${section._id}`, { is_active: !section.is_active });
        setSections(s => s.map(x => x._id === section._id ? res.data : x));
    };

    const handleSave = (doc) => {
        setSections(s => {
            const exists = s.find(x => x._id === doc._id);
            return exists ? s.map(x => x._id === doc._id ? doc : x) : [...s, doc];
        });
        setEditing(null);
    };

    const meta = TYPE_LABELS[type] || { label: type, desc: '', icon: '•' };
    const canAdd = !SINGLE_TYPES.includes(type) || sections.length === 0;

    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            {/* Header */}
            <button onClick={() => setOpen(o => !o)}
                className="flex items-center gap-4 w-full px-5 py-4 text-left hover:bg-[#F9FAFB] transition-colors">
                <span className="text-xl flex-shrink-0">{meta.icon}</span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111827]">{meta.label}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{meta.desc}</p>
                </div>
                <div className="flex items-center gap-3">
                    {!loading && open && sections.length > 0 && (
                        <span className="text-xs font-medium text-[#C9A84C] bg-[#FDF8EC] px-2.5 py-1 rounded-full">
                            {sections.length} élément{sections.length !== 1 ? 's' : ''}
                        </span>
                    )}
                    <div className={`w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center transition-transform ${open ? 'rotate-180' : ''}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                </div>
            </button>

            {/* Content */}
            {open && (
                <div className="border-t border-[#E5E7EB]">
                    {loading ? (
                        <div className="flex items-center justify-center py-8 gap-2">
                            <Spinner />
                            <span className="text-sm text-[#9CA3AF]">Chargement…</span>
                        </div>
                    ) : sections.length === 0 ? (
                        <p className="text-sm text-[#9CA3AF] text-center py-8">Aucun élément — ajoutez-en un ci-dessous</p>
                    ) : sections.map(s => (
                        <SectionRow key={s._id} section={s} onEdit={setEditing} onDelete={handleDelete} onToggle={handleToggle} />
                    ))}

                    <div className="px-5 py-3 border-t border-[#F3F4F6] bg-[#FAFAFA]">
                        {canAdd ? (
                            <button onClick={() => setEditing({})}
                                className="flex items-center gap-2 text-sm font-medium text-[#C9A84C] hover:text-[#B8973B] transition-colors">
                                <span className="w-6 h-6 rounded-full bg-[#FDF8EC] flex items-center justify-center text-lg leading-none">+</span>
                                Ajouter un élément
                            </button>
                        ) : sections.length > 0 ? (
                            <button onClick={() => setEditing(sections[0])}
                                className="flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#374151] transition-colors">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                Modifier
                            </button>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Form modal */}
            {editing !== null && (
                <SectionForm
                    section={editing?._id ? editing : null}
                    type={type}
                    page={page}
                    onSave={handleSave}
                    onCancel={() => setEditing(null)}
                />
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PAGE_CONFIG = {
    home: {
        label: 'Accueil',
        types: ['hero_slide', 'tagline', 'intro', 'univers', 'personal_branding', 'ethical_fashion', 'blog_banner'],
    },
    apropos: {
        label: 'À Propos',
        types: ['histoire', 'stat', 'valeur'],
    },
    impact: {
        label: 'Impact',
        types: ['impact_mvv', 'impact_stat', 'impact_engagement'],
    },
};

export default function AdminPages() {
    const [tab, setTab] = useState('home');
    const config = PAGE_CONFIG[tab];

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Administration</p>
                <h1 className="text-2xl font-semibold text-[#111827]">Pages Dynamiques</h1>
                <p className="text-sm text-[#6B7280] mt-1">Gérez le contenu des pages Accueil, À Propos et Impact</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-[#F3F4F6] p-1 rounded-xl w-fit">
                {Object.entries(PAGE_CONFIG).map(([key, conf]) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`text-sm font-medium px-5 py-2 rounded-lg transition-all ${
                            tab === key
                                ? 'bg-white text-[#111827] shadow-sm'
                                : 'text-[#6B7280] hover:text-[#374151]'
                        }`}>
                        {conf.label}
                    </button>
                ))}
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-blue-100 bg-blue-50 mb-6">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-sm text-blue-700">
                    Cliquez sur une section pour l'ouvrir et gérer ses éléments.
                    Les modifications sont visibles sur le site après actualisation.
                </p>
            </div>

            {/* Section groups */}
            <div className="space-y-3">
                {config.types.map(type => (
                    <SectionGroup key={type} type={type} page={tab} />
                ))}
            </div>
        </div>
    );
}
