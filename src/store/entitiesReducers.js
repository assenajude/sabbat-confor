import {combineReducers} from 'redux';

import espaceSlice from '../store/slices/espaceSlice'
import payementSlice from '../store/slices/payementSlice';
import categorieSlice from '../store/slices/categorieSlice';
import shoppingCartSlice from '../store/slices/shoppingCartSlice';
import articleSlice from '../store/slices/articleSlice';
import locationSlice from '../store/slices/locationSlice';
import orderSlice from '../store/slices/orderSlice';
import planSlice from '../store/slices/planSlice';
import pointRelaisSlice from '../store/slices/pointRelaisSlice';
import regionSlice from '../store/slices/regionSlice'
import villeSlice from '../store/slices/villeSlice'
import userAdresseSlice from '../store/slices/userAdresseSlice'
import factureSlice from '../store/slices/factureSlice'
import trancheSlice from './slices/trancheSlice'
import serviceSlice from './slices/serviceSlice'
import mainSlice from './slices/mainSlice'
import userFavoriteSlice from './slices/userFavoriteSlice'
import propositionSlice from './slices/propositionSlice'
import faqSlice from './slices/faqSlice'
import parrainageSlice from './slices/parrainageSlice'
import localisationSlice from './slices/localisationSlice'

export default combineReducers({
    espace: espaceSlice,
    payement: payementSlice,
    categorie: categorieSlice,
    shoppingCart: shoppingCartSlice,
    plan: planSlice,
    order: orderSlice,
    location: locationSlice,
    article: articleSlice,
    pointRelais: pointRelaisSlice,
    region: regionSlice,
    ville: villeSlice,
    userAdresse: userAdresseSlice,
    facture: factureSlice,
    tranche: trancheSlice,
    service: serviceSlice,
    main: mainSlice,
    userFavorite: userFavoriteSlice,
    proposition: propositionSlice,
    faq: faqSlice,
    parrainage: parrainageSlice,
    localisation: localisationSlice

})