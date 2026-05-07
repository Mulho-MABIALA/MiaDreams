import CrudPage from './_CrudPage';

const fields = [
    { name: 'title',       label: 'Nom du service *',                  type: 'text' },
    { name: 'description', label: 'Description (affiché en aperçu)',   type: 'textarea' },
    { name: 'image',       label: 'Image de couverture',               type: 'file' },
    { name: 'order',       label: 'Ordre d\'affichage',                type: 'number' },
];

export default function AdminServices() {
    return <CrudPage title="Services" apiPath="services" fields={fields} imageFields={['image']} />;
}
