import {createSlice} from "@reduxjs/toolkit";
import {apiRequest} from "../actionsCreators/apiActionCreator";


const factureSlice = createSlice({
    name:'facture',
    initialState: {
        list: [],
        encoursList: [],
        soldeList: [],
        newAdded: {},
        loading: false,
        error: null,
        orderFacture: {},
        newFactureCompter: 0,
        selectedFacture: {}
    },
    reducers: {
        factureRequested: (state, action) => {
            state.loading = true
            state.error = null

        },
        allFacturesReceived: (state, action) => {
          state.loading = false
          state.error = null
            state.newFactureCompter = 0
            const received = action.payload
          state.list = received

            const encoursTab = []
            const soldeTab = []
            received.forEach(facture => {
                const factureTranches = facture.Tranches
                const isTranchePaying = factureTranches.some(tranche => tranche.payedState !== 'confirmed')
                if(isTranchePaying){
                    encoursTab.push(facture)
                }else {
                    soldeTab.push(facture)
                }
            })
            state.encoursList = encoursTab
            state.soldeList = soldeTab
        },
        factureAdded: (state, action) => {
            state.loading = false
            state.error = null
            state.newFactureCompter ++
            state.newAdded = action.payload
            state.list.push(action.payload)
        },
        factureRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        factureUpdated: (state, action) => {
            state.error = null
            state.loading = false
            const updatedIndex = state.list.findIndex(item => item.id === action.payload.id)
            state.list[updatedIndex] = action.payload
            if(action.payload.montant === action.payload.solde) {
                const factureTranches = action.payload.Tranches
                const isTranchePaying = factureTranches.some(tranche => tranche.payedState !== 'confirmed')
                if(isTranchePaying === false) {
                    const newEncours = state.encoursList.filter(item => item.id !== action.payload.id)
                    state.encoursList = newEncours
                    state.soldeList.push(action.payload)
                }
            } else {
                let encoursIndex = state.encoursList.findIndex(item => item.id === action.payload.id)
                state.encoursList[encoursIndex] = action.payload
            }
        },
        resetConnectedFactures: (state) => {
            state.list =  []
            state.encoursList =  []
            state.soldeList =  []
            state.newAdded =  {}
            state.loading =  false
            state.error =  null
            state.orderFacture =  {}
            state.newFactureCompter =  0
        },
        selectedFactueGot: (state, action) => {
            state.loading = false
            state.error = null
            const newData = {...action.payload.selectedFacture, cartItems: action.payload.cartItems}
            state.selectedFacture = newData
        }
    }
})

export default factureSlice.reducer
const {factureAdded, factureRequested, factureUpdated, allFacturesReceived,
    factureRequestFailed, resetConnectedFactures, selectedFactueGot} = factureSlice.actions


//action creators
const url = '/factures'

export const addFacture = (facture) => apiRequest({
        url,
        method: 'post',
        data: facture,
        onStart: factureRequested.type,
        onSuccess: factureAdded.type,
        onError: factureRequestFailed.type
    })

export const getFactureUpdated = (facture) => apiRequest({
    url: url+'/update',
    method: 'patch',
    data:facture,
    onStart: factureRequested.type,
    onSuccess: factureUpdated.type,
    onError: factureRequestFailed.type
})


export const getFacturesByUser = () => apiRequest({
    url: url+'/byUser',
    method: 'get',
    onStart: factureRequested.type,
    onSuccess:allFacturesReceived.type,
    onError: factureRequestFailed.type
})

export const getSelectedFacture = (data) => apiRequest({
    url: url+'/getOne',
    method: 'post',
    data,
    onStart: factureRequested.type,
    onSuccess:selectedFactueGot.type,
    onError: factureRequestFailed.type
})

export const getConnectedFacturesReset = () => dispatch => {
    dispatch(resetConnectedFactures())
}