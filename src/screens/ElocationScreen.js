import React,{useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {View,FlatList} from 'react-native'
import AppText from "../components/AppText";
import ListFooter from "../components/list/ListFooter";
import routes from "../navigation/routes";
import AddToCartModal from "../components/shoppingCart/AddToCartModal";
import useAddToCart from "../hooks/useAddToCart";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {getSelectedOptions} from "../store/slices/mainSlice";
import useAuth from "../hooks/useAuth";
import AppCardNew from "../components/AppCardNew";
import useMainFeatures from "../hooks/useMainFeatures";


function ElocationScreen({navigation}) {
    const dispatch = useDispatch()
    const {userRoleAdmin}  = useAuth()
    const {addItemToCart} = useAddToCart()
    const {handleDeleteProduct} = useMainFeatures()
    const loading = useSelector(state => state.entities.location.loading)
    const cartLoading = useSelector(state => state.entities.shoppingCart.loading)
    const locations = useSelector(state => state.entities.location.availableLocation)
    const [elocationItemModal, setElocationItemModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState({})



    const handleAddToCart = async (item) => {
        if(item.ProductOptions.length > 1) {
            dispatch(getSelectedOptions(item))
            navigation.navigate(routes.LOCATION_DETAIL, item)
        }else {
            const result = await addItemToCart(item)
            if(result) {
                setSelectedItem(item)
                setElocationItemModal(true)
            }
        }
    }

    if (!loading && locations.length === 0) {
        return <>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <AppText>Aucune donnée trouvée</AppText>
        </View>
            {userRoleAdmin() && <ListFooter onPress={() => navigation.navigate(routes.NEW_LOCATION)} otherStyle={{alignSelf: 'flex-end', margin: 60}}/>}
            </>
    }


    return (
        <>
            <AppActivityIndicator visible={loading || cartLoading}/>
        {locations.length>0 && <FlatList data={locations} keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) =>
                      <AppCardNew
                          item={item}
                          addToCart={() => handleAddToCart(item)}
                          viewDetails={() =>{
                              dispatch(getSelectedOptions(item))
                              navigation.navigate('AccueilNavigator', {screen: routes.LOCATION_DETAIL, params: item})
                          }}
                          deleteItem={() => handleDeleteProduct(item)}
                          editItem={() => navigation.navigate(routes.NEW_LOCATION, item)}
                      />
                  }/>}
            {elocationItemModal &&  <AddToCartModal
                cartHeight={'100%'}
                itemModalVisible={elocationItemModal}
                source={{uri: selectedItem.imagesLocation[0]}}
                designation={selectedItem.libelleLocation}
                goToShoppingCart={() => {
                    setElocationItemModal(false)
                    navigation.navigate(routes.CART)
                }}
                goToHomeScreen={() => {
                    setElocationItemModal(false)
                }}
            />}
            {userRoleAdmin() &&  <View style={{
                position: 'absolute',
                right: 10,
                bottom: 10
            }} >
                <ListFooter onPress={() => navigation.navigate(routes.NEW_LOCATION)}/>
            </View>}
            </>
    );
}

export default ElocationScreen;