import {createSlice} from "@reduxjs/toolkit";
import {addToOrder} from '../actionsCreators/orderActionCreator'
import {apiRequest} from '../actionsCreators/apiActionCreator'


const orderSlice = createSlice({
    name: 'order',
    initialState: {
        currentUserOrders: [],
        listServices: [],
        listLocations: [],
        listArticles: [],
        currentOrder: {},
        currentOrderParrains: [],
        loading:false,
        orderSuccess: false,
        error: null,
        newAdded: {},
        servicePayementDate: Date.now(),
        totalCompter: 0,
        articleRefreshCompter: 0,
        locationRefreshCompter: 0,
        serviceRefreshCompter: 0,
        selectedOrder: {},
    },
    reducers: {
        orderRequested: (state, action) => {
            state.loading = true
            state.error = null
        },
        orderRequestFailed: (state, action) => {
            state.loading = false
            state.error  = action.payload
        },
        userOrdersReceived: (state, action) => {
            state.loading = false
            state.error = null
            const orderList = action.payload
            state.currentUserOrders = orderList
            const locationList = orderList.filter(item => item.typeCmde === 'location')
            const articleList = orderList.filter(item => item.typeCmde === 'article')
            const serviceList = orderList.filter(item => item.typeCmde === 'service')
            state.listLocations = locationList
            state.listArticles = articleList
            state.listServices = serviceList
            state.totalCompter = 0
            state.articleRefreshCompter = 0
            state.locationRefreshCompter = 0
            state.serviceRefreshCompter = 0
        },
        orderAdded: (state, action) => {
           const justAdded = action.payload
            state.loading = false
            state.orderSuccess = true
            state.error = null
            state.newAdded = justAdded
            state.currentUserOrders.push(justAdded)
            if(justAdded.typeCmde === 'article') {
                state.articleRefreshCompter += 1
                state.listArticles.push(justAdded)
            } else if(justAdded.typeCmde === 'location') {
                state.locationRefreshCompter += 1
                state.listLocations.push(justAdded)
            } else {
                state.serviceRefreshCompter += 1
                state.listServices.push(justAdded)
            }
            state.totalCompter+=1
        },
        resetOrder: (state) => {
            state.currentOrder = {}
            state.servicePayementDate = Date.now()
        },
        showItemDetail: (state, action) => {
            let selectedItem;
            const currentItem = action.payload
            if(currentItem.typeCmde === 'article') {
                selectedItem = state.listArticles.find(item => item.id === currentItem.id)
            } else if(currentItem.typeCmde === 'location') {
                selectedItem = state.listLocations.find(item => item.id === currentItem.id)
            } else {
                selectedItem = state.listServices.find(item => item.id === currentItem.id)
            }
            selectedItem.showDetails = !selectedItem.showDetails
        },
        editStatusSuccess: (state, action) => {
            state.loading = false
            const newItem = action.payload
            let oldItemIndex;
            if(newItem.typeCmde === 'location') {
                oldItemIndex = state.listLocations.findIndex(item => item.id === newItem.id)
                state.listLocations[oldItemIndex] = newItem
            } else if(newItem.typeCmde === 'service') {
                 oldItemIndex = state.listServices.findIndex(item => item.id === newItem.id)
                state.listServices[oldItemIndex] = newItem
            } else {
                 oldItemIndex = state.listArticles.findIndex(item => item.id === newItem.id)
                state.listArticles[oldItemIndex] = newItem
            }

        },
        deleteSuccess: (state, action)=> {
          state.loading = false
          state.error = null
            const deletedItem = action.payload
            if(deletedItem.typeCmde === 'service') {
                const services = state.listServices.filter(item => item.id !== deletedItem.id)
                state.listServices = services
            } else if(deletedItem.typeCmde === 'location') {
                const newLocations = state.listLocations.filter(item => item.id !== deletedItem.id)
                state.listLocations = newLocations
            } else {
                const newArticles = state.listArticles.filter(item => item.id !== deletedItem.id)
                state.listArticles = newArticles
            }
        },
        showFinalOrderDetails: (state, action) => {
            state.currentOrder.showDetails = !state.currentOrder.showDetails
        },
        orderParainAdded: (state, action) => {
         let existedCompte = state.currentOrderParrains.find(compte => Number(compte.id) === Number(action.payload.id))
            if(existedCompte) {
                if(existedCompte.parrainAction === 0) {
                    const newParrains = state.currentOrderParrains.filter(parrain => Number(parrain.id) !== Number(action.payload.id))
                    state.currentOrderParrains = newParrains
                }else existedCompte.parrainAction = action.payload.parrainAction
            } else {
          const newParrains = action.payload
          state.currentOrderParrains.push(newParrains)
            }
        },
        resetConnectedOrders: (state) => {
            state.currentUserOrders =  []
            state.listServices =  []
            state.listLocations =  []
            state.listArticles =  []
            state.currentOrder =  {}
            state.loading = false
            state.orderSuccess =  false
            state.error =  null
            state.newAdded =  {}
            state.servicePayementDate =  Date.now()
            state.totalCompter =  0
            state.articleRefreshCompter =  0
            state.locationRefreshCompter =  0
            state.serviceRefreshCompter =  0
        },
        selectedOrderGot: (state, action) => {
            state.loading = false
            state.error = null
            state.selectedOrder = action.payload
        }
    },
    extraReducers: {
        [addToOrder]: (state, action) => {
            const order = {
                items: action.payload.items,
                itemsLenght: action.payload.itemsLength,
                amount: action.payload.amount,
                type: action.payload.type,
                date: action.serviceDate
            }
            state.currentOrder = order
        }
    }
});

export default orderSlice.reducer;
const {orderAdded,resetOrder,
    editStatusSuccess,deleteSuccess,selectedOrderGot,
    userOrdersReceived,showItemDetail, orderRequested, orderRequestFailed,
    showFinalOrderDetails, resetConnectedOrders, orderParainAdded} = orderSlice.actions

const url = '/commandes'


export const makeOrder = (data) => apiRequest({
    url,
    method: 'post',
    data,
    onStart: orderRequested.type,
    onSuccess: orderAdded.type,
    onError: orderRequestFailed.type
})


export const getOrdersByUser = () => apiRequest({
    url: url+'/byUser',
    method: 'get',
    onStart: orderRequested.type,
    onSuccess: userOrdersReceived.type,
    onError: orderRequestFailed.type
})


export const getOrderReset = () => dispatch => {
    dispatch(resetOrder())
}

export const getItemDetail = (orderId) => dispatch => {
    dispatch(showItemDetail(orderId))
}

export const saveStatusEditing = (data) => apiRequest({
    url: url+'/update',
    data,
    method: 'patch',
    onStart: orderRequested.type,
    onSuccess: editStatusSuccess.type,
    onError: orderRequestFailed.type

})


export const createOrderContrat = (data) => apiRequest({
    url: url+'/Contrats',
    data,
    method: 'post',
    onStart: orderRequested.type,
    onSuccess: editStatusSuccess.type,
    onError: orderRequestFailed.type

})

export const getOrderDeleted = (data) => apiRequest({
    url: url+'/delete',
    data,
    method: 'delete',
    onStart: orderRequested.type,
    onSuccess: deleteSuccess.type,
    onError: orderRequestFailed.type
})

export const getSelectedOrder = (data) => apiRequest({
    url: url+'/getOne',
    data,
    method: 'post',
    onStart: orderRequested.type,
    onSuccess: selectedOrderGot.type,
    onError: orderRequestFailed.type
})



export const getOrderContratUpdate = (data) => apiRequest({
    url: url+'/contrats/update',
    data,
    method: 'patch',
    onStart: orderRequested.type,
    onSuccess: editStatusSuccess.type,
    onError: orderRequestFailed.type
})

export const getFinalOrderDetails = () => dispatch => {
    dispatch(showFinalOrderDetails())
}


export const getConnectedOrdersReset = () => dispatch => {
    dispatch(resetConnectedOrders())
}

export const getAddOrderParrain = (parrain) => dispatch => {
    dispatch(orderParainAdded(parrain))
}