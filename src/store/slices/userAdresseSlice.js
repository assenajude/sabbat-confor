import {createSlice} from "@reduxjs/toolkit";
import {apiRequest} from "../actionsCreators/apiActionCreator";

const userAdresseSlice = createSlice({
    name: 'userAdresse',
    initialState: {
        list: [],
        loading: false,
        error: null,
        userAdresses: [],
        selectedAdresse: {},
        adresseRelais: {},
        currentAdresse: {}

    },
    reducers: {
        userAdresseRequested: (state, action) => {
            state.loading = true
        },
        userAdresseReceived: (state, action) => {
            state.loading = false
            state.list = action.payload
            state.error = null
        },
        userAdresseFailed: (state, action)=> {
            state.loading = false
            state.error = action.payload
        },
        userAdresseAdded: (state, action) => {
            state.loading = false;
            state.error = null;
            const addedIndex = state.list.findIndex(item => item.id === action.payload.id)
            if(addedIndex !== -1) {
                state.list[addedIndex] = action.payload
            }else {
                state.list.push(action.payload)
            }
        },
        selectAdress: (state, action) => {
            let currentSelected = state.list.find(adress => adress.id === action.payload);
            if (currentSelected.selected) {
                currentSelected.selected = false
                state.selectedAdresse = {}
            } else {
                currentSelected.selected = true
                state.selectedAdresse = currentSelected
                const otherAdress = state.list.filter(adress => adress.id !== currentSelected.id);
                otherAdress.forEach(adress => adress.selected = false)
            }
            state.adresseRelais = currentSelected.PointRelai;


        },
        resetAdresse: (state) => {
            state.adresseRelais = {}
            state.selectedAdresse = {}
            state.list.forEach(adresse => {
                adresse.selected = false
            })
        },
        showAdressesDetail: (state, action) => {
            let selectedIndex = state.list.findIndex(item => item.id === action.payload)
            state.list[selectedIndex].showLivraisonDetail = !state.list[selectedIndex].showLivraisonDetail
        },
        showOrderAdresseDetails: (state) => {
            state.selectedAdresse.showDetails = !state.selectedAdresse.showDetails
        },
        currentAdresseSelected: (state, action) =>{
            state.currentAdresse = action.payload
        },
        userAdresseDeleted: (state, action) => {
            state.loading = false
            state.error = null
            const newList = state.list.filter(adresse => adresse.id !== action.payload.id)
            state.list = newList
        },
        resetConnectedAdresses: (state) => {
            state.list = []
            state.loading = false
            state.error = null
            state.userAdresses = []
            state.selectedAdresse = {}
            state.adresseRelais = {}
            state.currentAdresse = {}
        }
    }

})

export default userAdresseSlice.reducer;

const {userAdresseAdded, resetAdresse, userAdresseFailed, userAdresseReceived, userAdresseRequested,
    selectAdress, showAdressesDetail, showOrderAdresseDetails, currentAdresseSelected, userAdresseDeleted,
    resetConnectedAdresses} = userAdresseSlice.actions


const url = '/userAdresses'

export const saveAdresse = (adresse) => apiRequest({
    url,
    method: 'post',
    data: adresse,
    onStart: userAdresseRequested.type,
    onSuccess: userAdresseAdded.type,
    onError: userAdresseFailed.type
})

export const getAdresse = () => apiRequest({
    url,
    method: 'get',
    onStart: userAdresseRequested.type,
    onSuccess: userAdresseReceived.type,
    onError: userAdresseFailed.type

})

export const getSelectedAdress = (adressId) => dispatch => {
    dispatch(selectAdress(adressId))
}

export const getAdresseReset = () => dispatch => {
    dispatch(resetAdresse())
}

export const getAdLivraisonDetail = (itemId) => dispatch => {
    dispatch(showAdressesDetail(itemId))
}

export const getOrderAdresseDetails = () => dispatch => {
    dispatch(showOrderAdresseDetails())
}

export const getCurrentAdresseSelected = (adresse) => dispatch => {
    dispatch(currentAdresseSelected(adresse))
}

export const getAdresseDeleted = (adresse) =>apiRequest({
    url:url+'/delete',
    method: 'delete',
    data:adresse,
    onStart: userAdresseRequested.type,
    onSuccess: userAdresseDeleted.type,
    onError: userAdresseFailed.type

})

export const getConnectedAdressesReset = () => dispatch => {
    dispatch(resetConnectedAdresses())
}