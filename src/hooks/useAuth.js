import {getConnectedOrdersReset, getOrdersByUser} from "../store/slices/orderSlice";
import {getConnectedFacturesReset, getFacturesByUser} from "../store/slices/factureSlice";
import {getConnectedUserData, getConnectedUserReset} from "../store/slices/userProfileSlice";
import {getConnectedFavoritesReset, getUserFavoris} from "../store/slices/userFavoriteSlice";
import {getAdresse, getConnectedAdressesReset} from "../store/slices/userAdresseSlice";
import {getCartItems, getShoppingCartReset} from "../store/slices/shoppingCartSlice";
import {useDispatch, useSelector, useStore} from "react-redux";
import {
    getAllParrains,
    getCompteParrainReset, getPopulateParrainsOrders,
    getUserParrainageCompte,
    getUserParrains
} from "../store/slices/parrainageSlice";
import dayjs from "dayjs";
import {loadArticles} from "../store/slices/articleSlice";
import {getAllLocation} from "../store/slices/locationSlice";
import {getAllEspaces} from "../store/slices/espaceSlice";
import {loadCategories} from "../store/slices/categorieSlice";
import {loadPayements} from "../store/slices/payementSlice";
import {loadPlans} from "../store/slices/planSlice";
import {loadRelais} from "../store/slices/pointRelaisSlice";
import {getAllPropositions} from "../store/slices/propositionSlice";
import {getAllVilles} from "../store/slices/villeSlice";
import {getTranches} from "../store/slices/trancheSlice";
import {getServices} from "../store/slices/serviceSlice";
import {getAllMainData} from "../store/slices/mainSlice";
import {getLocalisations} from "../store/slices/localisationSlice";

let useAuth;
export default useAuth = () => {
    const dispatch = useDispatch()
    const store = useStore()
    const user = useSelector(state => state.auth.user)
    const formatPrice = (price) => {
        let formated = 0;
        if(price) {
            formated = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }
        return `${formated} XOF`
    }

    const formatDate = (date) => {
        let formated = 'no date found'
        if(date) formated = dayjs(date).format('DD/MM/YYYY HH:mm:ss')
        return formated
    }
    const userRoleAdmin = () => {
        if (Object.entries(user).length > 0){
            const adminIndex = user.roles.indexOf('ROLE_ADMIN')
            if(adminIndex !== -1) {
                return true
            } else return false
        }
        return false
    }

    const initUserDatas =  async () => {
        const connectedUser = store.getState().auth.user
        if(Object.keys(connectedUser).length > 0) {
            await dispatch(getOrdersByUser())
            await dispatch(getFacturesByUser())
            await dispatch(getConnectedUserData())
            await dispatch(getCartItems())
            await dispatch(getUserParrainageCompte({userId: connectedUser.id}))
            await dispatch(getUserParrains({userId: connectedUser.id}))
            dispatch(getUserFavoris())
            dispatch(getAdresse())
            const list = store.getState().entities.parrainage.comptes
            const userParrainCompte = list.find(compte => compte.UserId === connectedUser.id)
            if(userParrainCompte && userParrainCompte.Commandes){
               const  parrainsOrders = userParrainCompte.Commandes
                dispatch(getPopulateParrainsOrders(parrainsOrders))
            }
        }

    }

    const resetConnectedUserData = () => {
        dispatch(getConnectedOrdersReset())
        dispatch(getConnectedFacturesReset())
        dispatch(getConnectedFavoritesReset())
        dispatch(getConnectedAdressesReset())
        dispatch(getConnectedUserReset())
        dispatch(getCompteParrainReset())
        dispatch(getShoppingCartReset())
    }

    const dataSorter = (data) => {
        let sorTable = []
            for(let i=0; i<data.length; i++) {
                if (i === 0) {
                    sorTable.push(data[i])
                } else {
                    if (data[i].updatedAt < data[i - 1].updatedAt) {
                        sorTable.push(data[i])
                    } else sorTable.unshift(data[i])
                }
            }
        /*if (data && data.length >0) {
            sorTable.sort((a, b) => {
                if(a.updatedAt > b.updatedAt) return -1
                if(a.updatedAt < b.updatedAt) return 1
                return 0
            })
        }*/
        return sorTable
    }

    const isValidEmail = (email) => {
        const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/
        return re.test(email);
    }

    const getStarted = async () => {
        await dispatch(getAllMainData())
        await dispatch(loadCategories())
        dispatch(loadArticles())
        dispatch(getAllLocation())
        dispatch(getAllEspaces())
        dispatch(loadPayements())
        dispatch(loadPlans())
        dispatch(loadRelais())
        dispatch(getAllPropositions())
        dispatch(getAllVilles())
        dispatch(getTranches())
        dispatch(getServices())
        dispatch(getAllParrains())
        dispatch(getLocalisations())
    }

    return {getStarted,initUserDatas,userRoleAdmin, resetConnectedUserData, formatPrice, formatDate, dataSorter, isValidEmail}
}