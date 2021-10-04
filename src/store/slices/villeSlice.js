import {createSlice} from "@reduxjs/toolkit";
import {apiRequest} from "../actionsCreators/apiActionCreator";

const villeSlice = createSlice({
    name: 'ville',
    initialState: {
        list: [],
        loading: false,
        error: null,
        villeRelais: [],
        selectedVille: {},
        userVille: {}
    },
    reducers: {
        villeRequested: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        villeReceived: (state, action) => {
            state.loading = false;
            state.error = null;
            state.list = action.payload
        },
        villeAdded: (state, action) => {
            state.loading = false;
            state.error = null;
            let newList = state.list
            const addedIndex = newList.findIndex(item => item.id === action.payload.id)
            if(addedIndex !== -1) {
                newList[addedIndex] = action.payload
            }else {
                newList.push(action.payload)
            }
            state.list = newList
        },
        villeRequestFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },
        getLivraisonVille: (state, action) => {
           const selectedAdress = action.payload
            if(Object.keys(selectedAdress).length>0) {
            const selectedVille = state.list.find(ville => ville.id === selectedAdress.PointRelai.VilleId);
            state.userVille = selectedVille
            } else {
                state.userVille = {}
            }
        },
        resetUserVille: (state, action) => {
            state.userVille = {}
        },
        villeDeleted: (state, action) => {
            state.loading = false
            state.error = null
            const newList = state.list.filter(item => item.id !== action.payload.villeId)
            state.list = newList
        }
    }
});

export default villeSlice.reducer;

const {villeAdded, villeReceived, villeRequested, villeRequestFailed,
    getLivraisonVille, resetUserVille, villeDeleted} = villeSlice.actions


const url = '/villes'

export const saveVille = (ville) => apiRequest({
    url,
    method: 'post',
    data: ville,
    onStart: villeRequested.type,
    onSuccess: villeAdded.type,
    onError: villeRequestFailed.type
})

export const getAllVilles = () => apiRequest({
    url,
    method: 'get',
    onStart: villeRequested.type,
    onSuccess: villeReceived.type,
    onError: villeRequestFailed.type

})

export const deleteOneVille = (data) => apiRequest({
    url: url+'/deleteOne',
    method: 'delete',
    data,
    onStart: villeRequested.type,
    onSuccess: villeDeleted.type,
    onError: villeRequestFailed.type

})
export const getSelectedLivraisonVille = (relais) => dispatch => {
    dispatch(getLivraisonVille(relais))
}


export const getUserVilleReset = () => dispatch => {
    dispatch(resetUserVille())
}