import {create} from 'apisauce';
import settings from "../utilities/settings";



const apiClient = create({
    baseURL: settings.baseURL
});


export default apiClient;