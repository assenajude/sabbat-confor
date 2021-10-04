import React, {useState} from 'react';
import {View, FlatList} from "react-native";
import AppText from "../components/AppText";
import {useDispatch, useSelector} from "react-redux";
import ListFooter from "../components/list/ListFooter";
import routes from "../navigation/routes";
import useAddToCart from "../hooks/useAddToCart";
import AddToCartModal from "../components/shoppingCart/AddToCartModal";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {getSelectedOptions} from "../store/slices/mainSlice";
import useAuth from "../hooks/useAuth";
import AppCardNew from "../components/AppCardNew";
import useMainFeatures from "../hooks/useMainFeatures";

function EcommerceScreen({navigation}) {
    const dispatch = useDispatch()
    const {addItemToCart} = useAddToCart()
    const {userRoleAdmin} = useAuth()
    const {handleDeleteProduct} = useMainFeatures()
    const articles = useSelector(state => state.entities.article.searchList)
    const loading = useSelector(state => state.entities.article.loading)
    const cartLoading = useSelector(state => state.entities.shoppingCart.loading)
    const [showItemModal, setShowItemModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState({})

    const handleAddToCart = async (item) => {
        if(item.ProductOptions.length >= 1) {
            dispatch(getSelectedOptions(item))
            navigation.navigate('AccueilNavigator', {screen: routes.ARTICLE_DETAIL, params: item})
        } else {
            const result = await addItemToCart(item)
            if(result) {
                setSelectedItem(item)
                setShowItemModal(true)
            }
        }
    }

    return (
        <>
            <AppActivityIndicator visible={loading || cartLoading}/>
            {!loading && articles.length === 0 && <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <AppText>Aucune donnée trouvée</AppText>
            </View>}
        {articles.length>0 && <FlatList
            data={articles} keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) =>
                <AppCardNew
                    item={item}

                    editItem={() => navigation.navigate(routes.NEW_ARTICLE, item)}
                    deleteItem={() => handleDeleteProduct(item)}
                    addToCart={() => handleAddToCart(item)}
                    viewDetails={() => {
                        dispatch(getSelectedOptions(item))
                        navigation.navigate('AccueilNavigator', {screen: routes.ARTICLE_DETAIL, params: item})
                    }}/>
                  }/>}
                 {userRoleAdmin() && <View style={{position: 'absolute', bottom:10, right: 10}}>
                  <ListFooter onPress={() => navigation.navigate(routes.NEW_ARTICLE)}/>
                  </View>}
            {showItemModal && <AddToCartModal
                cartHeight={'100%'}
                source={{uri: selectedItem.imagesArticle[0]}}
                designation={selectedItem.designArticle}
                itemModalVisible={showItemModal}
                goToHomeScreen={() => setShowItemModal(false)}
                goToShoppingCart={() => {
                    setShowItemModal(false)
                    navigation.navigate(routes.CART)
                }}/>}
            </>
           );

}

export default EcommerceScreen;