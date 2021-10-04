import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector, useStore} from "react-redux";
import {View, FlatList, ToastAndroid} from "react-native";

import AppText from "../components/AppText";
import {getCategorieStateChange, getServiceRefreshed} from '../store/slices/serviceSlice'
import ListFooter from "../components/list/ListFooter";
import AppButton from "../components/AppButton";
import AddToCartModal from "../components/shoppingCart/AddToCartModal";
import useAddToCart from "../hooks/useAddToCart";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useAuth from "../hooks/useAuth";
import AppCardNew from "../components/AppCardNew";
import routes from "../navigation/routes";
import useMainFeatures from "../hooks/useMainFeatures";

function EserviceScreen({route, navigation}) {
    const selectedServices = route.params
    const dispatch = useDispatch()
    const store = useStore()
    const {userRoleAdmin} = useAuth()
    const {addItemToCart} = useAddToCart()
    const {handleDeleteProduct} = useMainFeatures()
    const loading = useSelector(state =>state.entities.service.loading)
    const refreshLoading = useSelector(state => state.entities.service.refreshLoading)
    const addToCartLoading = useSelector(state => state.entities.shoppingCart.loading)
    const serviceData = useSelector(state => state.entities.service.searchList)
    const categorieChanging = useSelector(state => state.entities.service.categorieChanging)
    const serviceError = useSelector(state => state.entities.service.error)
    const [showItemModal, setShowItemModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState({})
    const [currentData, setCurrentData] = useState([])

    const handleAddToCart = async (item) => {
        const result = await addItemToCart(item)
        if(result) {
            setSelectedItem(item)
            setShowItemModal(true)
        }

    }

    const handleRefreshService = async () => {
       await dispatch(getServiceRefreshed())
        const error = store.getState().entities.service.error
        if(error !== null) {
            ToastAndroid.showWithGravity("Impossible d'obtenir la mise à jour",
                ToastAndroid.LONG,
                ToastAndroid.CENTER)
            return;
        }
        setCurrentData(serviceData)
    }

    useEffect(() => {
        if(categorieChanging) {
            setCurrentData(serviceData)
            dispatch(getCategorieStateChange())
        }
        const unsubscribe = navigation.addListener('focus', () => {
            if(selectedServices && selectedServices.products) {
                setCurrentData(selectedServices.products)
            }else {
                setCurrentData(serviceData)
            }
        })
      return unsubscribe
    },[navigation, categorieChanging])

    if (!loading && serviceError !== null) {
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <AppText>Nous n'avons pas pu joindre le serveur.</AppText>
            <AppButton width={300} title='Recharger' onPress={handleRefreshService}/>
        </View>
    }

    return (
        <>
            <AppActivityIndicator visible={loading || addToCartLoading}/>
        {!loading && currentData.length> 0 && serviceError === null &&
        <FlatList
            refreshing={refreshLoading}
            onRefresh={handleRefreshService}
            data={currentData} keyExtractor={item =>item.id.toString()}
                  renderItem={({item})=>
                      <AppCardNew
                          item={item}
                          editItem={() => navigation.navigate(routes.NEW_SERVICE, item)}
                          deleteItem={() => handleDeleteProduct(item)}
                          viewDetails={() =>navigation.navigate(routes.SERVICE_DETAIL, item)}
                          addToCart={() => handleAddToCart(item)}
                      />
                  }/>}
            {!loading && currentData.length === 0 && serviceError === null && <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <AppText>Aucune donnée trouvée..</AppText>
            </View>}
                 {userRoleAdmin() && <View style={{position: 'absolute', bottom: 10, right: 10}}>
                      <ListFooter onPress={() => navigation.navigate(routes.NEW_SERVICE)}/>
                  </View>}

            {showItemModal &&  <AddToCartModal
                cartHeight={'100%'}
                source={{uri: selectedItem.imagesService[0]}}
                designation={selectedItem.libelle}
                goToHomeScreen={() => setShowItemModal(false)}
                itemModalVisible={showItemModal}
                goToShoppingCart={() => {
                    setShowItemModal(false)
                    navigation.navigate(routes.CART)
                }}/>}

            </>
    );
}

export default EserviceScreen;