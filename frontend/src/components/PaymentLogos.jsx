// Logos des moyens de paiement acceptés (fichiers dans public/img/paiement/).
// Pour ajouter un logo (ex. MTN, Visa) : déposer l'image dans ce dossier et l'ajouter ici.
const LOGOS = [
    { src: '/img/paiement/wave.png',         alt: 'Wave' },
    { src: '/img/paiement/orange-money.png', alt: 'Orange Money' },
    { src: '/img/paiement/mastercard.png',   alt: 'Carte bancaire (Mastercard)' },
];

export default function PaymentLogos({ height = 24, className = '' }) {
    const width = Math.round(height * 1.6);
    return (
        <div className={`flex items-center gap-1.5 ${className}`} aria-label="Moyens de paiement acceptés">
            {LOGOS.map(l => (
                <img key={l.src} src={l.src} alt={l.alt} title={l.alt} loading="lazy"
                     width={width} height={height} style={{ width, height }}
                     className="rounded-[4px] object-cover ring-1 ring-white/15 flex-shrink-0" />
            ))}
        </div>
    );
}
