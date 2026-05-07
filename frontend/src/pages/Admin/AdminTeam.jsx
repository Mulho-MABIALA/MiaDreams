import CrudPage from './_CrudPage';

const fields = [
    { name: 'name', label: 'Nom complet', type: 'text' },
    { name: 'role', label: 'Poste / Rôle', type: 'text' },
    { name: 'bio', label: 'Biographie', type: 'textarea' },
    { name: 'photo', label: 'Photo', type: 'file' },
    { name: 'order', label: 'Ordre d\'affichage', type: 'number' },
];

export default function AdminTeam() {
    return <CrudPage title="Équipe" apiPath="team" fields={fields} imageFields={['photo']} />;
}
