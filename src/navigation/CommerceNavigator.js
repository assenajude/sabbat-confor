import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import {Keyboard} from 'react-native'
import EcommerceScreen from "../screens/EcommerceScreen";
import colors from "../utilities/colors";
import NewArticleScreen from "../screens/NewArticleScreen";
import CartIconRight from "../components/shoppingCart/CartIconRight";
import routes from "./routes";
import AppTopBar from "../components/AppTopBar";
import AppAvatar from "../components/user/AppAvatar";
import {getSearchArticle, getSelectedCategoryArticles} from "../store/slices/articleSlice";

const CommerceStackNav = createStackNavigator()

function CommerceNavigator({navigation}) {
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const commerceCategories = useSelector(state => {
        const allCategories = state.entities.categorie.list
        const commerceCateg = allCategories.filter(categ => categ.typeCateg === 'article')
        return commerceCateg
    })
    const cartItemsLenght = useSelector(state => state.entities.shoppingCart.itemsLenght)
    const [searchValue, setSearchValue] = useState('')
    const [showCommerceModal, setShowCommerceModal] = useState(false)
    const [searchingInCommerce, setSearchingInCommerce] = useState(false)

    const handleCommerceSearch = () => {
        dispatch(getSearchArticle(searchValue))
    }

    const hideCommerceKeyboard = () => {
        setSearchingInCommerce(false)
    }

    const handleCategorySelection = (category) => {
        dispatch(getSelectedCategoryArticles(category))
        setShowCommerceModal(false)
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidHide', hideCommerceKeyboard)
        return () => {
            Keyboard.removeListener('keyboardDidHide', hideCommerceKeyboard)
        }
    }, [])

    return (
        <CommerceStackNav.Navigator screenOptions={{
            headerStyle: {backgroundColor: colors.rougeBordeau},
            headerTintColor: colors.blanc,
            headerTitleAlign: 'center',
            ...TransitionPresets.SlideFromRightIOS,
            headerRight: () => <CartIconRight cartLenght={cartItemsLenght} getToCartScreen={() => navigation.navigate('AccueilNavigator', {screen: routes.CART})}/>
        }}>
            <CommerceStackNav.Screen name='CommerceScreen' component={EcommerceScreen} options={{
                headerTitle: () =>
                    <AppTopBar
                        getAllCategories={() => {
                            dispatch(getSelectedCategoryArticles('all'))
                            setShowCommerceModal(false)
                        }}
                        getSelectedCategory={handleCategorySelection} categoryList={commerceCategories} searchValue={searchValue} changeSearchValue={(val) => setSearchValue(val)}
                        handleSearch={handleCommerceSearch} showSpaceModal={() => setShowCommerceModal(true)}
                        closeSpaceModal={() => setShowCommerceModal(false)} spaceModalVisible={showCommerceModal}
                        searching={searchingInCommerce} startingSearch={() => setSearchingInCommerce(true)} leaveInput={() => setSearchingInCommerce(false)}/>,
                headerLeft: () =>
                    <AppAvatar
                        showNottif={true}
                        user={user}
                        onPress={() =>navigation.openDrawer()}/>
            }}/>
            <CommerceStackNav.Screen name='NewArticleScreen' component={NewArticleScreen} options={{
                title: 'Ajout nouvel article'
            }}/>

        </CommerceStackNav.Navigator>
    );
}

export default CommerceNavigator;