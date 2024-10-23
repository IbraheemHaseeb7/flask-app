import axios from 'axios';

const access_token = localStorage.getItem("access_token");

const apiClient = axios.create({
	baseURL: "http://localhost:5000",
	headers: {
		"Authorization": access_token ? `Bearer ${access_token}` : null
	}
});

apiClient.interceptors.response.use(
	response => response,
	error => {
		return Promise.reject(error);
	}
);

export default apiClient;
