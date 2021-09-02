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
import {getToggleFavorite} from "../store/slices/userFavoriteSlice";
import useItemReductionPercent from "../hooks/useItemReductionPercent";
import useAuth from "../hooks/useAuth";
import AppCardNew from "../components/AppCardNew";
import useMainFeatures from "../hooks/useMainFeatures";
import OrderHelpModal from "../components/OrderHelpModal";


function ElocationScreen({navigation}) {
    const dispatch = useDispatch()
    const {userRoleAdmin}  = useAuth()
    const {addItemToCart} = useAddToCart()
    const {getReductionPercent} = useItemReductionPercent()
    const {handleDeleteProduct} = useMainFeatures()
    const loading = useSelector(state => state.entities.location.loading)
    const cartLoading = useSelector(state => state.entities.shoppingCart.loading)
    const locations = useSelector(state => state.entities.location.availableLocation)
    const [elocationItemModal, setElocationItemModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState({})
    const userFavorites = useSelector(state => state.entities.userFavorite.locationFavoris)
    const [selectedSource, setSelectedSource]= useState(null)
    const [helpModalVisible, setHelpModalVisible] = useState(false)



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
                          showHelpInfo={() => {
                              setSelectedSource(item.imagesLocation[0])
                              setHelpModalVisible(true)
                          }}
                          isFavorite={userFavorites.some(fav => fav.id === item.id)}
                          toggleFavorite={() => dispatch(getToggleFavorite(item))}
                          description={item.libelleLocation}
                          titleLabel={item.frequenceLocation.toLowerCase() == 'mensuelle'?'Coût mensuel:':'Coût journalier:'}
                          addToCart={() => handleAddToCart(item)}
                          aideInfo={item.aide}
                          firstTitle={item.coutPromo}
                          secondTitle={item.coutReel}
                          viewDetails={() =>{
                              dispatch(getSelectedOptions(item))
                              navigation.navigate('AccueilNavigator', {screen: routes.LOCATION_DETAIL, params: item})
                          }}
                          itemType={item.Categorie?item.Categorie.typeCateg : 'e-location'}
                          deleteItem={() => handleDeleteProduct(item)}
                          editItem={() => navigation.navigate(routes.NEW_LOCATION, item)}
                          itemReductionPercent={getReductionPercent(item)}
                          notInStock={item.qteDispo <= 0} title={item.libelleLocation}
                          source={{uri: item.imagesLocation[0]}}/>
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
            <OrderHelpModal
                selectedSource={{uri: selectedSource}}
                closeModal={() => setHelpModalVisible(false)}
                visible={helpModalVisible}/>
            </>
    );
}

export default ElocationScreen;