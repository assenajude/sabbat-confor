import apiClient from "../../api/http-common";
import * as actions from '../actionsCreators/apiActionCreator';
import authStorage from "../persistStorage";
const api = ({dispatch}) => next => async action => {

    if (action.type !== actions.apiRequest.type) return next(action);
    const {url, method, data, onStart, onSuccess, onError} = action.payload;
    const authToken = await authStorage.getStoredToken()
    if (onStart) dispatch({type: onStart})
    next(action);
    try {
        let response;
        if (data) {
            let formData;
            const dataKeys = Object.keys(data)
            if(dataKeys.indexOf('images') !== -1) {
                formData = new FormData();
                dataKeys.forEach(key => {
                        if(key === 'images' ) {
                          data.images.forEach(image => {
                         formData.append('images', {
                             name: image.split('/').pop(),
                             type: 'image/jpeg',
                             uri: image
                         })
                     })
                    }
                    else {
                        formData.append(key, data[key])
                    }
                })
            } else {
                formData = data
            }
            response = await apiClient.axiosInstance.request({
                url,
                method,
                data:formData,
                headers: {'x-access-token':authToken}
            })

        } else {
            response = await apiClient.axiosInstance.request({
                url,
                method,
                headers: {'x-access-token':authToken}
            })
        }
        if(response.data.accessToken) {
            await authStorage.storeToken(response.data.accessToken)
        }
        dispatch(actions.apiRequestSuccess(response.data))
        if (onSuccess) dispatch({type: onSuccess, payload: response.data});
    } catch (e) {
        dispatch(actions.apiRequestFailed(e.message))
        if (onError) dispatch({type: onError, payload: e.message})

    }
    


}

export default api