/**
 * Spinner de chargement réutilisable
 * Usage: <Spinner /> ou <Spinner small />
 */
export default function Spinner({ small = false }) {
    return (
        <svg
            className={`animate-spin text-[#C9A84C] ${small ? 'w-3.5 h-3.5' : 'w-5 h-5'}`}
            viewBox="0 0 24 24" fill="none"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
        </svg>
    );
}
