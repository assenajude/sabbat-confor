import {apiRequest} from "../actionsCreators/apiActionCreator";
import {createSlice} from "@reduxjs/toolkit";

const userFavoriteSlice = createSlice({
    name: 'userFavorite',
    initialState: {
        list: [],
        articleFavoris: [],
        locationFavoris: [],
        error: null,
        loading: false,
        favoriteCompter: 0
    },
    reducers: {
        favoriteRequested: (state, action) => {
            state.loading = true
            state.error = null
        },
        favoriteRequestedFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        favoriteReceived: (state, action) => {
            state.loading = false
            const locationsFav = action.payload.locationFavoris
            state.error = null
            const articlesFav = action.payload.articleFavoris
            state.articleFavoris = articlesFav
            state.locationFavoris = locationsFav
            const formatArticleFav = []
            const formatLocationFav = []
            articlesFav.forEach(article => {
               formatArticleFav.push({
                   id: article.id,
                   libelle: article.designArticle,
                   image: article.imagesArticle[0],
                   prixReel: article.prixReel,
                   prixPromo: article.prixPromo,
                   description: article.descripArticle,
                   type: 'article'
               })
            })

            locationsFav.forEach(location => {
                formatLocationFav.push({
                    id: location.id,
                    libelle: location.libelleLocation,
                    image: location.imagesLocation[0],
                    prixReel: location.coutReel,
                    prixPromo: location.coutPromo,
                    description: location.descripLocation,
                    type: 'location'
                })
            })
            state.list = [...formatArticleFav,...formatLocationFav]
            state.favoriteCompter = 0
        },
        toggleFavorrite: (state, action) => {
            let itemIndex;
            const selectedItem = action.payload
            let compter = 0
            if(selectedItem.Categorie.typeCateg === 'article') {
                itemIndex = state.articleFavoris.findIndex(item => item.id === selectedItem.id)
                if(itemIndex >= 0 ) {
                    state.articleFavoris.splice(itemIndex, 1)
                }  else {
                    state.articleFavoris.push(selectedItem)
                    compter += 1
                }
            } else {
                itemIndex = state.locationFavoris.findIndex(item => item.id === selectedItem.id)
                if(itemIndex >= 0) {
                    state.locationFavoris.splice(itemIndex, 1)
                } else {
                    state.locationFavoris.push(selectedItem)
                    compter += 1
                }
            }
            if(compter === 1) {
                state.favoriteCompter += 1
            } else {
                if(state.favoriteCompter > 0) {
                    state.favoriteCompter -= 1
                }
                const itemInListIndex = state.list.findIndex(item => item.id === selectedItem.id && item.type === selectedItem.Categorie.typeCateg)
                state.list.splice(itemInListIndex, 1)
            }
           state.loading = false
        },
        resetConnectedFavorites: (state) => {
            state.list = []
            state.articleFavoris = []
            state.locationFavoris = []
            state.error = null
            state.loading = false
            state.favoriteCompter = 0
        }
    }
})

export default userFavoriteSlice.reducer
const {toggleFavorrite, favoriteReceived, favoriteRequested,
    favoriteRequestedFailed, resetConnectedFavorites} = userFavoriteSlice.actions


const url = '/users/me/favoris'

export const getUserFavoris = () => apiRequest({
    url,
    method: 'get',
    onStart: favoriteRequested.type,
    onSuccess: favoriteReceived.type,
    onError: favoriteRequestedFailed.type
})

export const getToggleFavorite = (item) => apiRequest({
    url,
    data: item,
    method: 'patch',
    onStart: favoriteRequested.type,
    onSuccess: toggleFavorrite.type,
    onError: favoriteRequestedFailed.type
})

export const getConnectedFavoritesReset = () => dispatch => {
    dispatch(resetConnectedFavorites())
}