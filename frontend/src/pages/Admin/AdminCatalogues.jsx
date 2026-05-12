import CrudPage from './_CrudPage';

const fields = [
    { name: 'name',        label: 'Nom',                type: 'text' },
    { name: 'description', label: 'Description',         type: 'textarea' },
    { name: 'cover_image', label: 'Image de couverture', type: 'file', accept: 'image/*' },
    { name: 'pdf_path',    label: 'Fichier PDF',         type: 'file', accept: '.pdf,application/pdf', isPdf: true },
];

export default function AdminCatalogues() {
    return <CrudPage title="Catalogues" apiPath="catalogues" fields={fields} imageFields={['cover_image']} pdfFields={['pdf_path']} />;
}
