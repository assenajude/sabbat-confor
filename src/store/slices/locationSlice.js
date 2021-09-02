import {createSlice} from "@reduxjs/toolkit";
import {apiRequest} from "../actionsCreators/apiActionCreator";

const locationSlice = createSlice({
    name: 'location',
    initialState: {
        list: [],
        availableLocation: [],
        loading: true,
        addSuccess: false,
        error: null,
        newAdded: {},
        userLocations: []
    },
    reducers: {
        locationRequested: (state) => {
            state.loading = true
            state.error = null
        },
        locationReceived: (state, action) => {
            state.loading = false
            state.error = null
            state.list = action.payload
            state.availableLocation = action.payload
        },
        locationRequestFailed: (state, action) => {
            state.loading = false
            state.addSuccess = false
            state.error = action.payload
        },
        locationAdded: (state, action)=> {
            state.loading = false
            state.addSuccess = true
            const addedIndex = state.availableLocation.findIndex(loc => loc.id === action.payload.id)
            if(addedIndex !== -1) {
                state.availableLocation[addedIndex] = action.payload
            } else {
                state.list.push(action.payload)
                state.availableLocation.unshift(action.payload)
                state.newAdded = action.payload
            }

        },
        searchLocation: (state, action) => {
            const searchTerme = action.payload.toLowerCase()
            const currentList = state.list
            if(searchTerme.length === 0) {
                state.availableLocation = currentList
            } else {
                const filterList = currentList.filter(location => {
                    const searchLabel = location.libelleLocation+' '+location.descripLocation
                    const normalizedLabel = searchLabel.toLowerCase()
                    if(normalizedLabel.search(searchTerme) !== -1) return true
                })
                state.availableLocation = filterList
            }
        },
        locationByCategories: (state, action) => {
            if(action.payload ==='all') {
                state.availableLocation = state.list
            } else {
                if(action.payload.toLocalisation) {
                    state.availableLocation = action.payload.locations
                }else {
                    const newLocations = state.list.filter(location => location.CategorieId === action.payload.id)
                    state.availableLocation = newLocations
                }
            }
        }
    }
});

const {locationAdded, locationReceived, locationRequested, locationRequestFailed, searchLocation,
    locationByCategories} = locationSlice.actions
export default locationSlice.reducer


const url = '/locations'
export const getAllLocation = () => apiRequest({
    url,
    method: 'get',
    onStart: locationRequested.type,
    onSuccess: locationReceived.type,
    onError: locationRequestFailed.type

})

export const addLocation = (location) => apiRequest({
    url,
    method: 'post',
    data: location,
    onStart: locationRequested.type,
    onSuccess: locationAdded.type,
    onError: locationRequestFailed.type
})


export const getLocationSearch = (value)=> dispatch => {
    dispatch(searchLocation(value))
}

export const getLocationsByCategories = (category) => dispatch => {
    dispatch(locationByCategories(category))
}