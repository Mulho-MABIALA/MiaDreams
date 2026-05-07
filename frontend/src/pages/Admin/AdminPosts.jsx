import CrudPage from './_CrudPage';

const fields = [
    { name: 'title', label: 'Titre', type: 'text' },
    { name: 'slug', label: 'Slug', type: 'text' },
    { name: 'category', label: 'Catégorie', type: 'text' },
    { name: 'excerpt', label: 'Extrait', type: 'textarea' },
    { name: 'content', label: 'Contenu', type: 'textarea' },
    { name: 'cover_image', label: 'Image de couverture', type: 'file' },
    { name: 'is_published', label: 'Statut', type: 'select', options: [{ value: 'true', label: 'Publié' }, { value: 'false', label: 'Brouillon' }] },
];

export default function AdminPosts() {
    return <CrudPage title="Articles" apiPath="posts" fields={fields} imageFields={['cover_image']} />;
}
