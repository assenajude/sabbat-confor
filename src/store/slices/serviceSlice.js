import {createSlice} from "@reduxjs/toolkit";
import {apiRequest} from "../actionsCreators/apiActionCreator";

const serviceSlice = createSlice({
    name: 'service',
    initialState: {
      loading: false,
      list: [],
        searchList: [],
      error: null,
        serviceRefresh: 0,
       refreshLoading: false,
        categorieChanging: false
    },
    reducers: {
        serviceRequested: (state) =>{
            state.loading = true
            state.error = null
        },
        startingRefresh: (state, action) => {
            state.refreshLoading = true
            state.error = null
        },
        serviceReceived: (state, action) => {
            state.error = null
            state.loading = false
            state.refreshLoading = false
            state.serviceRefresh = 0
            state.list = action.payload
            state.searchList = action.payload
        },
        serviceRequestFailed:(state, action) => {
            state.loading = false
            state.error = action.payload
        },
        serviceAdded: (state, action)=> {
            state.loading = false
            state.error = null
            const addedIndex = state.list.findIndex(service => service.id === action.payload.serviceId)
            if(addedIndex !== -1) {
                state.list[addedIndex] = action.payload
            }else {
            state.list.push(action.payload)
            state.searchList.unshift(action.payload)
            state.serviceRefresh ++

            }
        },
        searchService: (state, action) => {
            const searchLabel = action.payload.toLowerCase()
            const currentList = state.list
            if(searchLabel.length === 0 ) {
                state.searchList = currentList
            } else {
                const filteredList = currentList.filter(service => {
                    const searchString = service.libelle+' '+service.description
                    const normalizedString = searchString.toLowerCase()
                    if(normalizedString.search(searchLabel) !== -1) return true
                })
                state.searchList = filteredList
            }
        },
        servicesByCategories: (state, action) => {
            if(action.payload === 'all') {
                state.searchList = state.list
            } else {
                const newServices = state.list.filter(service => service.CategorieId === action.payload.id)
                state.searchList = newServices
            }
            state.categorieChanging = true
        },
        serviceDeleted: (state, action) => {
            state.error = null
            state.loading = false
            const deletedIndex = state.list.findIndex(service => service.id === action.payload.serviceId)
            if(deletedIndex !== -1) {
                const newList = state.searchList.filter(service => service.id !== action.payload.serviceId)
                state.searchList = newList
            }
        },
        categorieStateChanged: (state) => {
            state.categorieChanging = false
        }
    }
})


const {serviceAdded, serviceReceived, serviceRequested, serviceRequestFailed, startingRefresh,
    searchService, servicesByCategories, serviceDeleted, categorieStateChanged} = serviceSlice.actions
export default serviceSlice.reducer

const url = '/services'

export const getServices = () => apiRequest({
    url,
    method: 'get',
    onStart: serviceRequested.type,
    onSuccess: serviceReceived.type,
    onError: serviceRequestFailed.type
})

export const addService = (service) => apiRequest({
    url,
    method: 'post',
    data: service,
    onStart: serviceRequested.type,
    onSuccess: serviceAdded.type,
    onError:serviceRequestFailed.type
})

export const getServiceRefreshed = () => apiRequest({
    url,
    method: 'get',
    onStart: startingRefresh.type,
    onSuccess: serviceReceived.type,
    onError: serviceRequestFailed.type
})

export const deleteOneService = (data) => apiRequest({
    url : url+'/deleteOne',
    data,
    method: 'delete',
    onStart: serviceRequested.type,
    onSuccess:serviceDeleted.type,
    onError: serviceRequestFailed.type
})

export const getSearchService = (service) => dispatch => {
    dispatch(searchService(service))
}

export const getServicesByCategories = (category) => dispatch => {
    dispatch(servicesByCategories(category))
}

export const getCategorieStateChange = () => dispatch => {
    dispatch(categorieStateChanged())
}