import axios from 'axios';

const imageApi = axios.create({ baseURL: 'https://picsum.photos/v2/list' });

export default imageApi;
