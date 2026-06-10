import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

const ICONS = {
    success: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    error:   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
    warning: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    info:    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

const STYLES = {
    success: { bg: '#F0FDF4', border: '#86EFAC', color: '#15803D', icon: '#16A34A' },
    error:   { bg: '#FEF2F2', border: '#FECACA', color: '#DC2626', icon: '#DC2626' },
    warning: { bg: '#FFFBEB', border: '#FDE68A', color: '#92400E', icon: '#D97706' },
    info:    { bg: '#FDF8EC', border: '#C9A84C40', color: '#6B4F3A', icon: '#C9A84C' },
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const toast = useCallback((message, type = 'info', duration = 3500) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }, []);

    const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast container */}
            <div style={{
                position: 'fixed', top: '80px', right: '20px', zIndex: 9999,
                display: 'flex', flexDirection: 'column', gap: '8px',
                maxWidth: '360px', width: '100%',
                pointerEvents: 'none',
            }}>
                {toasts.map(t => {
                    const s = STYLES[t.type] || STYLES.info;
                    return (
                        <div key={t.id} style={{
                            background: s.bg,
                            border: `1px solid ${s.border}`,
                            borderRadius: '10px',
                            padding: '12px 16px',
                            display: 'flex', alignItems: 'flex-start', gap: '10px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                            animation: 'slideInRight 0.25s ease',
                            pointerEvents: 'all',
                            cursor: 'pointer',
                        }} onClick={() => remove(t.id)}>
                            <span style={{ color: s.icon, flexShrink: 0, marginTop: '1px' }}>{ICONS[t.type]}</span>
                            <p style={{ fontSize: '13px', color: s.color, lineHeight: 1.5, flex: 1 }}>{t.message}</p>
                            <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', color: s.color, cursor: 'pointer', opacity: 0.5, padding: '0', flexShrink: 0, fontSize: '16px', lineHeight: 1 }}>×</button>
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
