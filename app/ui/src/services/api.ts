import axios from "axios";

const api = axios.create( {
    baseURL : 'http://192.168.18.128:3000/smartcampus' ,
    headers: {
    'Content-Type': 'application/json',}

})


export default api