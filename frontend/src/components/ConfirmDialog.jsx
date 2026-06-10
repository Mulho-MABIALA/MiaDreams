import { createContext, useContext, useState, useCallback } from 'react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
    const [state, setState] = useState(null);

    const confirm = useCallback(({ title, message, confirmLabel = 'Confirmer', danger = false }) =>
        new Promise(resolve => {
            setState({ title, message, confirmLabel, danger, resolve });
        }),
    []);

    const handleClose = (result) => {
        state?.resolve(result);
        setState(null);
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            {state && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 10000,
                    background: 'rgba(0,0,0,0.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '16px',
                    animation: 'fadeIn 0.15s ease',
                }} onClick={e => { if (e.target === e.currentTarget) handleClose(false); }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '14px',
                        padding: '28px',
                        width: '100%', maxWidth: '400px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        animation: 'scaleIn 0.2s ease',
                    }}>
                        {/* Icône */}
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '50%',
                            background: state.danger ? '#FEF2F2' : '#FDF8EC',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '16px',
                        }}>
                            {state.danger ? (
                                <svg width="20" height="20" fill="none" stroke="#DC2626" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                                </svg>
                            ) : (
                                <svg width="20" height="20" fill="none" stroke="#C9A84C" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                            )}
                        </div>

                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E110A', marginBottom: '8px' }}>
                            {state.title}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, marginBottom: '24px' }}>
                            {state.message}
                        </p>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleClose(false)}
                                style={{
                                    flex: 1, padding: '10px',
                                    border: '1px solid #E5E7EB', borderRadius: '8px',
                                    background: '#fff', color: '#6B7280',
                                    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                                }}>
                                Annuler
                            </button>
                            <button
                                onClick={() => handleClose(true)}
                                style={{
                                    flex: 1, padding: '10px',
                                    border: 'none', borderRadius: '8px',
                                    background: state.danger ? '#DC2626' : '#C9A84C',
                                    color: '#fff',
                                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                }}>
                                {state.confirmLabel}
                            </button>
                        </div>
                    </div>

                    <style>{`
                        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
                        @keyframes scaleIn { from { opacity:0; transform:scale(.95) } to { opacity:1; transform:scale(1) } }
                    `}</style>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
    return ctx;
}
