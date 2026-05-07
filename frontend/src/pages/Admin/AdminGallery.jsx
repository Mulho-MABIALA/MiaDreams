import CrudPage from './_CrudPage';

const fields = [
    { name: 'caption', label: 'Légende', type: 'text' },
    { name: 'image', label: 'Photo', type: 'file' },
    { name: 'order', label: 'Ordre', type: 'number' },
];

export default function AdminGallery() {
    return <CrudPage title="Galerie" apiPath="gallery" fields={fields} imageFields={['image']} />;
}
