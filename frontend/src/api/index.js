import axios from 'axios';

const api = axios.create({
  baseURL: 'https://socialnetwork-1-culr.onrender.com/api/users',
});

export const addUser = (name) => api.post('/add', { name });
export const connectUsers = (userId1, userId2) => api.post('/connect', { userId1, userId2 });
export const getNetwork = () => api.get('/network');
export const getInfluencer = () => api.get('/influencer');
export const getShortestPath = (startId, endId) => api.get(`/shortest-path/${startId}/${endId}`);
export const getRecommendations = (userId) => api.get(`/recommend/${userId}`);
export const getCommunities = () => api.get('/communities');

export default api;
