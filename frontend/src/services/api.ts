import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request interceptor to add Auth Token
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

interface ConnectCredentials {
    username: string;
    password?: string;
    security_token?: string;
    domain?: string;
}

export const salesforceApi = {
    connect: (credentials: ConnectCredentials) => api.post('/salesforce/connect', credentials),
    disconnect: () => api.post('/salesforce/disconnect'),
    getStatus: () => api.get('/salesforce/status'),
    checkDataStatus: () => api.get('/salesforce/data-status'),
    seedData: () => api.post('/salesforce/seed'),
    runAgent: (agentName: string) => api.post(`/agents/run/${agentName}`),
};

export default api;
