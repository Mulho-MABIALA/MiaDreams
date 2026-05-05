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

    useEffect(() => {
        axios.get('/api/settings')
            .then(res => setSettings(res.data))
            .catch(() => {});
    }, []);

    const showFlash = (msg, type = 'success') => {
        setFlash({ msg, type });
        setTimeout(() => setFlash(null), 5000);
    };

    return (
        <AppContext.Provider value={{ ...settings, flash, showFlash }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
