import axios from "axios";

const options = {
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
	headers: {
		"Content-Type": "multipart/form-data",
	},
};

const API = axios.create(options);

export default API;
