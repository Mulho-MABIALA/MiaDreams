import { Link } from 'react-router-dom';

/**
 * AdminCard — carte statistique premium pour l'admin
 * Usage: <AdminCard label="Commandes" value={18} sub="total reçues" icon={<Icon/>} color="#C9A84C" to="/admin/commandes" />
 */
export default function AdminCard({ label, value, sub, icon, color = '#C9A84C', to, trend }) {
    const card = (
        <div className="admin-stat-card" style={{ '--card-color': color }}>
            {/* Reflet / shimmer */}
            <div className="admin-stat-card__shimmer" />

            {/* Barre colorée en haut */}
            <div className="admin-stat-card__bar" />

            <div className="admin-stat-card__inner">
                {/* Icône */}
                <div className="admin-stat-card__icon">
                    <span style={{ color }}>{icon}</span>
                </div>

                {/* Valeur */}
                <div className="admin-stat-card__value">
                    {value ?? <span style={{ opacity: .2 }}>—</span>}
                </div>
            </div>

            {/* Label + sub */}
            <p className="admin-stat-card__label">{label}</p>
            {sub && <p className="admin-stat-card__sub">{sub}</p>}

            {/* Trend optionnel */}
            {trend !== undefined && (
                <div className="admin-stat-card__trend" style={{ color: trend >= 0 ? '#22C55E' : '#EF4444' }}>
                    {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </div>
            )}
        </div>
    );

    return to
        ? <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>{card}</Link>
        : card;
}
