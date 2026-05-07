import CrudPage from './_CrudPage';

const fields = [
    { name: 'title',          label: 'Titre de l\'épisode',           type: 'text' },
    { name: 'guest',          label: 'Invité(e)',                      type: 'text' },
    { name: 'episode_number', label: 'Numéro d\'épisode',             type: 'number' },
    { name: 'season',         label: 'Saison',                        type: 'number' },
    { name: 'duration',       label: 'Durée (ex: 42 min)',            type: 'text' },
    { name: 'description',    label: 'Description',                   type: 'textarea' },
    { name: 'spotify_url',    label: 'Lien Spotify',                  type: 'url' },
    { name: 'youtube_url',    label: 'Lien YouTube',                  type: 'url' },
    { name: 'apple_url',      label: 'Lien Apple Podcasts',           type: 'url' },
    { name: 'audio_url',      label: 'URL Audio direct (optionnel)',  type: 'url' },
    { name: 'thumbnail',      label: 'Image de couverture',           type: 'file' },
    { name: 'published_at',   label: 'Date de publication',           type: 'date' },
    { name: 'order',          label: 'Ordre d\'affichage',            type: 'number' },
    {
        name: 'is_published',
        label: 'Publié',
        type: 'checkbox',
        checkboxLabel: 'Visible sur le site (publié)',
    },
];

export default function AdminPodcasts() {
    return <CrudPage title="Podcasts" apiPath="podcasts" fields={fields} imageFields={['thumbnail']} />;
}
