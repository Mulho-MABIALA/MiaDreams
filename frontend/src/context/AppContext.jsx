import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [settings, setSettings] = useState({
        companyInfo: null,
        socialMediaLinks: [],
        navBrands: [],
        navCatalogues: [],
    });
    const [flash, setFlash] = useState(null);

    const refetchSettings = () => {
        axios.get('/api/settings', { params: { _t: Date.now() } })
            .then(res => setSettings(res.data))
            .catch(() => {});
    };

    useEffect(() => {
        refetchSettings();
    }, []);

    const showFlash = (msg, type = 'success') => {
        setFlash({ msg, type });
        setTimeout(() => setFlash(null), 5000);
    };

    return (
        <AppContext.Provider value={{ ...settings, flash, showFlash, refetchSettings }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
