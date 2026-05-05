import { useState, useEffect } from 'react';
import axios from 'axios';

export function useApi(url, params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        axios.get(url, { params })
            .then(res => { if (!cancelled) { setData(res.data); setLoading(false); } })
            .catch(err => { if (!cancelled) { setError(err); setLoading(false); } });
        return () => { cancelled = true; };
    }, [url, JSON.stringify(params)]);

    return { data, loading, error };
}
