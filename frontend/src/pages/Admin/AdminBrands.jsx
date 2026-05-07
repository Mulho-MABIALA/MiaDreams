import CrudPage from './_CrudPage';

const fields = [
    { name: 'name',         label: 'Nom',                         type: 'text' },
    { name: 'slug',         label: 'Slug (auto-généré)',          type: 'text' },
    { name: 'href',         label: 'Lien (ex: /miaDreams)',       type: 'text' },
    { name: 'header_title', label: 'Titre affiché (Hero)',        type: 'text' },
    { name: 'description',  label: 'Description',                 type: 'textarea' },
    { name: 'youtube_id',   label: 'YouTube ID (vidéo fond)',     type: 'text' },
    { name: 'image',        label: 'Image de couverture',         type: 'file' },
    { name: 'order',        label: 'Ordre dans le menu',          type: 'number' },
];

export default function AdminBrands() {
    return <CrudPage title="Marques" apiPath="brands" fields={fields} imageFields={['image']} />;
}
