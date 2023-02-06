import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode";
import dayjs from 'dayjs'

const baseURL = 'http://localhost:8000/'

let authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null

const axiosInstance = axios.create({
    baseURL,
    headers:{}
});

export default axiosInstance;