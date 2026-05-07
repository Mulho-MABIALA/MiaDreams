import CrudPage from './_CrudPage';

const fields = [
    { name: 'name', label: 'Nom', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'cover_image', label: 'Image de couverture', type: 'file' },
    { name: 'pdf_path', label: 'Fichier PDF', type: 'file' },
];

export default function AdminCatalogues() {
    return <CrudPage title="Catalogues" apiPath="catalogues" fields={fields} imageFields={['cover_image']} />;
}
