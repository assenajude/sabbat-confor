import {createSlice} from "@reduxjs/toolkit";
import {apiRequest} from "../actionsCreators/apiActionCreator";

const parrainageSlice = createSlice({
    name: 'parrainage',
    initialState: {
        loading: false,
        error: null,
        comptes: [],
        list : [],
        userParrains: [],
        userFilleuls: [],
        inSponsoringState: [],
        respondMessageState: [],
        searchCompteList: [],
        parrainageOrders : []
    },
    reducers: {
        parrainageRequested: (state, action) => {
            state.loading = true
            state.error = null
        },
        parrainCompteReceived: (state, action) => {
            state.error = null
            state.loading = false
            const allComptes = action.payload
            allComptes.forEach(compte => {
                const soldeCpte = compte.initial + compte.gain - compte.depense-compte.quotite
                compte.solde = soldeCpte

            })
            state.comptes = allComptes
        },
        parrainCompteAdded: (state, action) => {
            state.error = null
            state.loading = false
            let newCompte = action.payload
            const soldeCpte = newCompte.initial + newCompte.gain - newCompte.depense-newCompte.quotite
            newCompte.solde = soldeCpte
            state.comptes.push(newCompte)
            state.searchCompteList.push(newCompte)
        },
        parrainageRequestFailed: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        allParrainageCompteReceived: (state, action) => {
            state.error = null
            state.loading = false
            const receiveds = action.payload.comptes
            state.list = receiveds
            state.searchCompteList = receiveds
        },
        compteParrainEdited: (state, action) => {
          state.error = null
            state.loading = false
            let result = action.payload
            const soldeCpte = result.initial + result.gain - result.depense-result.quotite
            result.solde = soldeCpte
            const selectedIndex = state.comptes.findIndex(item => item.id === result.id)
            const searchIndex = state.searchCompteList.findIndex(item => item.id === result.id)
            if(selectedIndex !== -1 ) {
                state.comptes[selectedIndex] = result
            }
            if(searchIndex !== -1) state.searchCompteList[searchIndex] = result
            else state.searchCompteList.push(result)
        },
        parrainageMessageEdited: (state, action) => {
            state.loading = false
            state.error = null
            const updatedCompte = action.payload
            const parrainUser = updatedCompte.parrain
            const parrainageCompte = updatedCompte.compte
                const sponsoringIndex = state.inSponsoringState.findIndex(item => item.id === parrainUser.id)
            if(parrainUser.ParrainFilleul.inSponsoring) {
            if(sponsoringIndex !== -1) {
                state.inSponsoringState[parrainUser.id] = parrainUser
            } else {
                state.inSponsoringState.push(parrainUser)
            }
            } else {
                if(sponsoringIndex !== -1) {
                    const newStates = state.inSponsoringState.filter(item => item.id !== parrainUser.id)
                    state.inSponsoringState = newStates
                }
            }

                const respondedIndex = state.respondMessageState.findIndex(item => item.id === parrainUser.id)
            if(parrainUser.ParrainFilleul.sponsoringState !== 'pending') {
                if(respondedIndex !== -1) {
                    state.respondMessageState[respondedIndex] = parrainUser
                } else {
                    state.respondMessageState.push(parrainUser)
                }
            } else {
                if(respondedIndex !== -1) {
                    const newResponseState = state.respondMessageState.filter(msg => msg.id !== parrainUser.id)
                    state.respondMessageState = newResponseState
                }
            }

                const parrainIndex = state.userParrains.findIndex(item => item.id === parrainageCompte.id)
                const filleulIndex = state.userFilleuls.findIndex(item => item.id === parrainageCompte.id)
            if(updatedCompte.isParrain) {
                if(filleulIndex !== -1) state.userFilleuls.splice(filleulIndex, 1)
                if (parrainIndex !== -1) state.userParrains[parrainIndex] = parrainageCompte
                else state.userParrains.push(parrainageCompte)
            }
            if(updatedCompte.isFilleul) {
                if(parrainIndex !== -1) state.userParrains.splice(parrainIndex, 1)
                if(filleulIndex !== -1) state.userFilleuls[filleulIndex] = parrainageCompte
                else state.userFilleuls.push(parrainageCompte)
            }


        },
        resetParrainCompte: (state, action) => {
            state.loading = false
            state.error = null
            state.comptes = []
            state.list  = []
            state.userParrains = []
            state.userFilleuls = []
            state.inSponsoringState = []
            state.respondMessageState = []
            state.searchCompteList = []
            state.parrainageOrders = []
        },
        parrainsReceived: (state, action) => {
            state.error = null
            state.loading = false
                const parrainageData = action.payload
            state.userParrains = parrainageData.parrains
            state.userFilleuls = parrainageData.filleuls
            const newTab = [...parrainageData.userParrainsState, ...parrainageData.userFilleulsState]
            newTab.forEach(item => {
                const itemSponsoring  = item.ParrainFilleul.inSponsoring;
                const itemRespondMessage = item.ParrainFilleul.sponsoringState;
                if(itemSponsoring) {
                    state.inSponsoringState.push(item)
                }
                if( itemRespondMessage!== 'pending') {
                    state.respondMessageState.push(item)
                }

            })
        },
        editQuotite :(state, action) => {
            let selectedCompte = state.comptes.find(compte => compte.id === action.payload.id)
            selectedCompte.editQuotite = !selectedCompte.editQuotite
        },
        editInitial: (state, action) => {
            let selectedCompte = state.comptes.find(compte => compte.id === action.payload.id)
            selectedCompte.editInitial = !selectedCompte.editInitial
        },
        parrainageResponseEdited: (state, action) => {
            let selectedCompte = state.searchCompteList.find(cpte => cpte.id === action.payload.id)
            selectedCompte.editResponse = !selectedCompte.editResponse
        },
        selectedParrain: (state, action) => {
            let selectedParrainCompte = state.userParrains.find(compte => compte.id === action.payload.id)
            selectedParrainCompte.selected = !selectedParrainCompte.selected
        },
        showQuotiteEditer: (state, action) => {
            let selectedCompte = state.userParrains.find(cpt => cpt.id === action.payload.id)
            selectedCompte.showQuotiteEdit = action.payload.showQuotiteEdit
            selectedCompte.parrainAction = action.payload.parrainAction
            const oldQuotite = selectedCompte.quotite
            const newQuotite = action.payload.parrainAction
            const resteQuotite = newQuotite? oldQuotite - newQuotite: oldQuotite
            selectedCompte.resteQuotite = resteQuotite
        },
        showSponsorDetails: (state, action) => {
            const sponsoringTab = [...state.userParrains, ...state.userFilleuls]
            let selectedSponsor = sponsoringTab.find(sp => sp.id === action.payload.id)
            selectedSponsor.sponsorDetails = !selectedSponsor.sponsorDetails
        },
        showParrainOrderDetais : (state, action) => {
            const compteOrders = state.parrainageOrders
            let selectedOrder = compteOrders.find(order => order.id === action.payload.id)
            selectedOrder.showDetails = !selectedOrder.showDetails
        },
        parrainageOrderPopulated: (state, action) => {
            if (action.payload && action.payload.length>0) state.parrainageOrders = action.payload
        }

    }
})

export default parrainageSlice.reducer
const {parrainageRequested, parrainageRequestFailed, parrainCompteReceived,
    allParrainageCompteReceived, resetParrainCompte, parrainsReceived, editInitial, editQuotite, compteParrainEdited,
    parrainCompteAdded, parrainageResponseEdited,showParrainOrderDetais,
    selectedParrain, showQuotiteEditer, showSponsorDetails, parrainageMessageEdited, parrainageOrderPopulated} = parrainageSlice.actions

const url = '/compteParrainages'

export const getAllParrains = () => apiRequest({
    url:url+"/allComptes",
    method: 'get',
    onStart: parrainageRequested.type,
    onSuccess: allParrainageCompteReceived.type,
    onError: parrainageRequestFailed.type
})

export const getUserParrainageCompte = (userData) => apiRequest({
    url: url+'/userCompte',
    data:userData,
    method: 'post',
    onStart: parrainageRequested.type,
    onSuccess: parrainCompteReceived.type,
    onError: parrainageRequestFailed.type
})

export const createParrainageCompte = (data) => apiRequest({
    url,
    data,
    method: 'post',
    onStart: parrainageRequested.type,
    onSuccess: parrainCompteAdded.type,
    onError: parrainageRequestFailed.type
})

export const getInitialEdit = (data) => apiRequest({
    url:url+'/editInitial',
    data,
    method: 'patch',
    onStart: parrainageRequested.type,
    onSuccess: compteParrainEdited.type,
    onError: parrainageRequestFailed.type
})

export const getCompteParrainActivate = (data) => apiRequest({
    url:url+'/activeCompte',
    data,
    method: 'patch',
    onStart: parrainageRequested.type,
    onSuccess: compteParrainEdited.type,
    onError: parrainageRequestFailed.type
})

export const getEditQuotiteSave =(data) => apiRequest({
    url:url+'/editQuotite',
    data,
    method: 'patch',
    onStart: parrainageRequested.type,
    onSuccess: compteParrainEdited.type,
    onError: parrainageRequestFailed.type
})

export const getUserParrains = (data) => apiRequest({
    url: url+'/parrainageData',
    method: 'post',
    data,
    onStart: parrainageRequested.type,
    onSuccess: parrainsReceived.type,
    onError: parrainageRequestFailed.type
})

export const getParrainageRequestSent = (data) => apiRequest({
    url: url+'/parrainageRequest',
    data,
    method: 'patch',
    onStart: parrainageRequested.type,
    onSuccess: parrainageMessageEdited.type,
    onError: parrainageRequestFailed.type
})
export const getParrainageResponseSend = (data) => apiRequest({
    url: url+'/parrainageResponse',
    data,
    method: 'patch',
    onStart: parrainageRequested.type,
    onSuccess: parrainageMessageEdited.type,
    onError: parrainageRequestFailed.type
})

export const getManageParrainage = (data) =>apiRequest({
    url:url+'/manageParrainage',
    data,
    method: 'patch',
    onStart: parrainageRequested.type,
    onSuccess: parrainageMessageEdited.type,
    onError: parrainageRequestFailed.type

})

export const getCompteParrainReset = () => dispatch => {
    dispatch(resetParrainCompte())
}

export const getStartQuotiteEdit = (compte) => dispatch => {
    dispatch(editQuotite(compte))
}

export const getStartInitialEdit = (compte) => dispatch => {
    dispatch(editInitial(compte))
}

export const getParrainageResponseEdit = (compte) => dispatch => {
    dispatch(parrainageResponseEdited(compte))
}

export const getSelectedParrain = (compte) => dispatch => {
    dispatch(selectedParrain(compte))
}

export const getQuotiteEditShown = (compte) => dispatch => {
    dispatch(showQuotiteEditer(compte))
}

export const getSponsorDetails = (sponsor) => dispatch => {
    dispatch(showSponsorDetails(sponsor))
}

export const getOrderParrainDetails = (data) => dispatch => {
    dispatch(showParrainOrderDetais(data))
}

export const getPopulateParrainsOrders = (orders) => dispatch => {
    dispatch(parrainageOrderPopulated(orders))
}