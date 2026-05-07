import CrudPage from './_CrudPage';

const fields = [
    { name: 'name',        label: 'Nom de l\'initiative *',              type: 'text' },
    { name: 'description', label: 'Description',                         type: 'textarea' },
    { name: 'youtube_id',  label: 'ID YouTube (ex: dQw4w9WgXcQ)',        type: 'text' },
    { name: 'image',       label: 'Image (si pas de vidéo YouTube)',      type: 'file' },
    { name: 'order',       label: 'Ordre d\'affichage',                   type: 'number' },
    { name: 'is_active',   label: 'Actif',  type: 'checkbox', checkboxLabel: 'Visible sur la page Impact' },
];

export default function AdminInitiatives() {
    return <CrudPage title="Initiatives / Impact" apiPath="initiatives" fields={fields} imageFields={['image']} />;
}
