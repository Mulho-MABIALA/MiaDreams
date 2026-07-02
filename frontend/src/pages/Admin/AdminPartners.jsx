import CrudPage from './_CrudPage';

const fields = [
    { name: 'name',    label: 'Nom *',              type: 'text', required: true },
    { name: 'website', label: 'Lien du site (optionnel)', type: 'url' },
    { name: 'logo',    label: 'Logo *',             type: 'file', accept: 'image/*' },
];

export default function AdminPartners() {
    return (
        <CrudPage
            title="Ils nous font confiance"
            apiPath="partners"
            fields={fields}
            imageFields={['logo']}
        />
    );
}
