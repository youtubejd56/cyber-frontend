import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://cyber-backend-ciui.onrender.com'

const api = axios.create({
    baseURL: `${API_BASE}/api`,
})

api.interceptors.request.use((config: any) => {
    const token = Cookies.get('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
        // Only redirect to login for auth endpoints, not for all 401s
        const url = error.config?.url || ''
        if (error.response?.status === 401 && (url.includes('/auth/') || url.includes('/me'))) {
            Cookies.remove('token')
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

// Auth
export const authAPI = {
    register: (data: { username: string; email: string; password: string }) =>
        api.post('/auth/register/', data),
    login: (username: string, password: string) =>
        api.post('/auth/login/', { username, password }),
    getMe: () => api.get('/auth/me/'),
    updateAvatar: (avatar: string) =>
        api.post('/auth/update-avatar/', { avatar }),
}

// Rooms
export const roomsAPI = {
    getAll: (params?: { category?: string; difficulty?: string }) =>
        api.get('/rooms/', { params }),
    getOne: (id: string) => api.get(`/rooms/${id}/`),
    join: (id: string) => api.post(`/rooms/${id}/join/`),
    submitFlag: (roomId: string, taskId: string, flag: string) =>
        api.post(`/rooms/${roomId}/tasks/${taskId}/submit/`, { flag }),
}

// Machines
export const machinesAPI = {
    getAll: (params?: { os?: string; difficulty?: string }) =>
        api.get('/machines/', { params }),
    getOne: (id: string) => api.get(`/machines/${id}/`),
    submitFlag: (machineId: string, flag: string, flagType: 'user' | 'root') =>
        api.post(`/machines/${machineId}/submit-flag/`, { flag, flag_type: flagType }),
    submitTask: (machineId: string, taskIndex: number, answer: string) =>
        api.post(`/machines/${machineId}/submit-task/`, { task_index: taskIndex, answer }),
    submitRating: (machineId: string, rating: number) =>
        api.post(`/machines/${machineId}/rate/`, { rating }),
    completeMachine: (machineId: string) =>
        api.post(`/machines/${machineId}/complete/`),
}

// Leaderboard
export const leaderboardAPI = {
    get: () => api.get('/leaderboard/'),
}

// Stats
export const statsAPI = {
    get: () => api.get('/stats/'),
}

// VPN Configuration
export const vpnAPI = {
    getConfig: () => api.get('/vpn/config/'),
    createConfig: () => api.post('/vpn/config/'),
    saveCustomConfig: (configContent: string) => api.post('/vpn/custom-config/', { config: configContent }),
    getStatus: () => api.get('/vpn/status/'),
}

// Machine Instances (Docker)
export const instancesAPI = {
    getInstance: (machineId: string) => api.get(`/machines/${machineId}/instance/`),
    startInstance: (machineId: string) => api.post(`/machines/${machineId}/instance/`, { action: 'start' }),
    stopInstance: (machineId: string) => api.post(`/machines/${machineId}/instance/`, { action: 'stop' }),
    getUserInstances: () => api.get('/instances/'),
    getDockerStatus: () => api.get('/docker/status/'),
}

// PwnBox (Browser-based Attack Environment)
export const pwnboxAPI = {
    getStatus: () => api.get('/pwnbox/'),
    start: () => api.post('/pwnbox/'),
    stop: () => api.post('/pwnbox/stop/'),
}

// Frames (PUBG Conquer Style)
export const framesAPI = {
    getAll: () => api.get('/frames/'),
    getMyFrames: () => api.get('/frames/my/'),
    selectFrame: (frameId: string) => api.post('/frames/select/', { frame_id: frameId }),
}

export default api
