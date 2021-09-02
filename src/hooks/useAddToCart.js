import React from 'react'
import {useStore, useDispatch, useSelector} from "react-redux";
import {getAddItemToCart} from "../store/slices/shoppingCartSlice";
import {Alert} from "react-native";
import routes from "../navigation/routes";
import {useNavigation} from '@react-navigation/native'
let useAddToCart;
export default useAddToCart = () => {
    const store = useStore()
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const user = useSelector(state => state.auth.user)
    const cartLenght = useSelector(state => state.entities.shoppingCart.itemsLenght)
    const allArticles = useSelector(state => state.entities.article.availableArticles)
    const allLocations = useSelector(state => state.entities.location.list)
    const allServices = useSelector(state => state.entities.service.list)

    const addItemToCart = async (item) => {
        let addedSuccess = false
        if(Object.keys(user).length === 0) {
            Alert.alert("Bienvenue", "veuillez vous connecter pour faire des commandes.", [{
                text: 'ok', onPress: () => navigation.navigate(routes.LOGIN)
            }, {
                text: 'plutard', onPress: () => {return;}
            }])
            return;
        }
        const cartTypeCmde = store.getState().entities.shoppingCart.type
        const itemKeys = Object.keys(item)
        let typeCmde;
        if(itemKeys.indexOf('typeCmde') !== -1) {
            typeCmde = item.typeCmde
        } else {
            typeCmde = item.Categorie.typeCateg
        }

        let qteStock=0
        let isDispo = false
        let selectedProduct;
        if(typeCmde === 'article') {
            selectedProduct = allArticles.find(article => article.id === item.id)
            if(selectedProduct)qteStock = selectedProduct.qteStock
            if(qteStock<=0) return alert("Cet article n'est plus en stock.")
        }else if(typeCmde === 'location') {
            selectedProduct = allLocations.find(location => location.id === item.id)
            if(selectedProduct)qteStock = selectedProduct.qteDispo
            if(qteStock<=0)return alert("Cette location n'est plus disponible.")
        }else {
            selectedProduct = allServices.find(service =>service.id === item.id)
            if(selectedProduct && selectedProduct.isDispo) isDispo = true
            if(!isDispo)return alert("Ce service n'est plus disponible.")
        }
        if(cartTypeCmde !== '' && cartTypeCmde !== typeCmde) {
           return  alert(`Une commande de ${cartTypeCmde} est en cours, veillez la finaliser ou l'annuler`)
        }
        if(cartTypeCmde=== 'location' || cartTypeCmde === 'service' && cartLenght>=1) {
            return alert("Vous ne pouvez faire qu'une commande de location ou de service à la fois. Veuillez finaliser d'abord la commande en cours.")
        }
            await dispatch(getAddItemToCart(item))
            addedSuccess = true
        return addedSuccess
    }

    return {addItemToCart};
};