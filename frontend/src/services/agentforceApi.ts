import api from './api';

export const agentforceApi = {
    getStatus: () => api.get('/agentforce/status'),
    getActivity: () => api.get('/agentforce/activity'),
};
