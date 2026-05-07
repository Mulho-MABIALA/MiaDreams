import { useState } from 'react';
import CrudPage from './_CrudPage';

const GOLD = '#C9A84C';

const postFields = [
    { name: 'title',       label: 'Titre',              type: 'text'     },
    { name: 'slug',        label: 'Slug (URL)',          type: 'text'     },
    { name: 'category',    label: 'Catégorie',           type: 'text'     },
    { name: 'excerpt',     label: 'Extrait',             type: 'textarea' },
    { name: 'content',     label: 'Contenu',             type: 'textarea' },
    { name: 'cover_image', label: 'Image de couverture', type: 'file'     },
    { name: 'is_published',label: 'Statut',              type: 'select',
      options: [{ value: 'true', label: 'Publié' }, { value: 'false', label: 'Brouillon' }] },
];

const podcastFields = [
    { name: 'title',           label: 'Titre',                type: 'text'     },
    { name: 'description',     label: 'Description',          type: 'textarea' },
    { name: 'guest',           label: 'Invité(e)',            type: 'text'     },
    { name: 'season',          label: 'Saison (ex: 1)',       type: 'number'   },
    { name: 'episode_number',  label: 'N° épisode',          type: 'number'   },
    { name: 'duration',        label: 'Durée (ex: 42 min)',   type: 'text'     },
    { name: 'spotify_url',     label: 'Lien Spotify',         type: 'url'      },
    { name: 'youtube_url',     label: 'Lien YouTube',         type: 'url'      },
    { name: 'apple_url',       label: 'Lien Apple Podcasts',  type: 'url'      },
    { name: 'thumbnail',       label: 'Image de couverture',  type: 'file'     },
    { name: 'order',           label: 'Ordre',                type: 'number'   },
];

export default function AdminBlogPodcast() {
    const [tab, setTab] = useState('articles');

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Contenu</p>
                <h1 className="text-2xl font-semibold text-[#111827]">
                    Blog <span style={{ color: GOLD }}>&</span> Podcast
                </h1>
            </div>

            {/* Onglets */}
            <div className="flex gap-1 mb-6 bg-[#F3F4F6] p-1 rounded-xl w-fit">
                {[
                    { id: 'articles', label: 'Articles', icon: <IcoPost /> },
                    { id: 'podcasts', label: 'Podcasts', icon: <IcoPod  /> },
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg transition-all ${
                            tab === t.id
                                ? 'bg-white text-[#111827] shadow-sm'
                                : 'text-[#6B7280] hover:text-[#374151]'
                        }`}>
                        <span className={tab === t.id ? 'text-[#C9A84C]' : 'text-[#9CA3AF]'}>{t.icon}</span>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Contenu */}
            <div style={{ display: tab === 'articles' ? 'block' : 'none' }}>
                <CrudPage title="" apiPath="posts" fields={postFields} imageFields={['cover_image']} hideHeader />
            </div>
            <div style={{ display: tab === 'podcasts' ? 'block' : 'none' }}>
                <CrudPage title="" apiPath="podcasts" fields={podcastFields} imageFields={['thumbnail']} hideHeader />
            </div>
        </div>
    );
}

function IcoPost() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
    );
}

function IcoPod() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="2"/>
            <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
        </svg>
    );
}
