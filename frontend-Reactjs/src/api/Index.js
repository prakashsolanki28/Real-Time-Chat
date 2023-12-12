import axios from 'axios';
const axiosInstance = axios.create({
    timeout: 5000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const saveData = (userData, api_route) => {
    return axiosInstance.post(api_route, userData);
};

export const updateData = (userData, api_route) => {
    return axiosInstance.post(api_route, userData);
};


export const searchUser = (userData, api_route) => {
    return axiosInstance.post(api_route, userData);
};

export const getUser = (api_route) => {
    return axiosInstance.post(api_route);
};

export const getUserRooms = (api_route) => {
    return axiosInstance.get(api_route);
};

export const getRoomMessage = (data, api_route) => {
    return axiosInstance.post(api_route, data);
};

export const sendMessage = (data, api_route) => {
    return axiosInstance.post(api_route, data);
}