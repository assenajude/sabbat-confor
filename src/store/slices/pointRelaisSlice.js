import {createSlice} from '@reduxjs/toolkit'
import {apiRequest} from "../actionsCreators/apiActionCreator";

const relaisSlice = createSlice({
    name: 'pointRelais',
    initialState: {
        list: [],
        loading: false,
        selectedRelais: {},
        error: null
    },
    reducers: {
        relaisRequested: (state, action) => {
            state.loading = true
        },
        relaisReceived: (state, action) => {
            state.loading = false
            state.list = action.payload
        },
        relaisRequestFailded: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        relaisAdded: (state, action) => {
            state.loading = false
            state.list.push(action.payload)
        },
        selectedRelais: (state, action) => {
           state.selectedRelais = state.list.find(relais => relais.nom === action.payload)
        }
    },
    extraReducers: {

    }

});


export default relaisSlice.reducer;
const {relaisAdded, relaisReceived, relaisRequested, relaisRequestFailded, selectedRelais} = relaisSlice.actions;

const url = '/pointRelais'

export const loadRelais = () => apiRequest({
    url,
    method: 'get',
    onStart: relaisRequested.type,
    onSuccess: relaisReceived.type,
    onError: relaisRequestFailded.type
});


export const addRelais = (relais) => dispatch => {
    dispatch (apiRequest({
        url,
        method: 'post',
        data: relais,
        onStart: relaisRequested.type,
        onSuccess: relaisAdded.type,
        onError: relaisRequestFailded.type
    }));

}

