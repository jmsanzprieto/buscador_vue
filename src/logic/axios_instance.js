// axios_instance.js
import axios from 'axios';
// Creamos una instancia de axios
const axiosInstance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com', // EndPoint de pruebas
    timeout: 5000, // Tiempo máximo de espera para la petición
});

export default axiosInstance;