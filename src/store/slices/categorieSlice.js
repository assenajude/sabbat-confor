import {createSlice} from '@reduxjs/toolkit';
import {apiRequest} from '../actionsCreators/apiActionCreator'

const categorieSlice = createSlice({
    name: 'categorie',
    initialState: {
        list: [],
        loading: false,
        error: null,
        espaceCategories: []
    },
    reducers: {
        categoriesRequested: (state, action) => {
          state.loading = true
            state.error = null
        },
        categoriesReceived: (state, action) => {
            state.list = action.payload;
            state.loading = false
            state.error = null
        },
        categoriesRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        categorieAdded: (state, action) => {
            state.loading = false
            state.error = null
            const addedIndex = state.list.findIndex(categ => categ.id === action.payload.id)
            if(addedIndex !== -1) {
                state.list[addedIndex] = action.payload
            }else {
                state.list.push(action.payload);
            }
        },
        categorieDeleted: (state, action) => {
            state.error = null
            state.loading = false
            const newCategories = state.list.filter(categ => categ.id !== action.payload.categorieId)
            state.list = newCategories
        }
    }

});

export default categorieSlice.reducer;
const {categoriesReceived, categoriesRequested, categoriesRequestFailed,
    categorieAdded,categorieDeleted} = categorieSlice.actions

// actions creators

const url = '/categories'

export const loadCategories = () => apiRequest({
    method: 'get',
    url,
    onStart: categoriesRequested.type,
    onSuccess: categoriesReceived.type,
    onError: categoriesRequestFailed.type
})

export const addCategorie = (categorie) => (dispatch) => {
    dispatch (apiRequest({
        url,
        method: 'post',
        data: categorie,
        onStart: categoriesRequested.type,
        onSuccess: categorieAdded.type,
        onError: categoriesRequestFailed.type
    }))
}

export const deleteOneCategorie = (categorie) => apiRequest({
        url: url+'/deleteOne',
        method: 'delete',
        data: categorie,
        onStart: categoriesRequested.type,
        onSuccess: categorieDeleted.type,
        onError: categoriesRequestFailed.type
    })
