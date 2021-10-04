import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import {Keyboard} from 'react-native'
import EserviceScreen from "../screens/EserviceScreen";
import colors from "../utilities/colors";
import NewServiceScreen from "../screens/NewServiceScreen";
import CartIconRight from "../components/shoppingCart/CartIconRight";
import routes from "./routes";
import AppTopBar from "../components/AppTopBar";
import AppAvatar from "../components/user/AppAvatar";
import {getSearchService, getServicesByCategories} from "../store/slices/serviceSlice";

const ServiceStackNav = createStackNavigator()

function ServiceNavigator({navigation}) {
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const itemsLenght = useSelector(state => state.entities.shoppingCart.itemsLenght)
    const serviceCatgories = useSelector(state => {
        const currentCateg = state.entities.categorie.list
        const newCategories = currentCateg.filter(categ => categ.typeCateg ===  'service')
        return newCategories
    })
    const [search, setSearch] = useState('')
    const [serviceSearching, setServiceSearching] = useState(false)
    const [serviceModalVisible, setServiceModalVisible] = useState(false)

    const handleSearch = () => {
        dispatch(getSearchService(search))
    }

    const hideServicekeyboard = () => {
        setServiceSearching(false)
    }

    const handleCategorySelection = (category) => {
        dispatch(getServicesByCategories(category))
        setServiceModalVisible(false)
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidHide', hideServicekeyboard)
        return () => {
            Keyboard.removeListener('keyboardDidHide', hideServicekeyboard)
        }
    }, [])

    return (
        <ServiceStackNav.Navigator screenOptions={{
            headerStyle: {backgroundColor: colors.rougeBordeau},
            headerTintColor: colors.blanc,
            headerTitleAlign: 'center',
            ...TransitionPresets.SlideFromRightIOS,
            headerRight: () => <CartIconRight cartLenght={itemsLenght} getToCartScreen={() => navigation.navigate('AccueilNavigator', {screen: routes.CART})} />
        }}>
            <ServiceStackNav.Screen name='ServiceScreen' component={EserviceScreen} options={{
                headerTitle: () => <AppTopBar categoryList={serviceCatgories} getAllCategories={() => {
                    dispatch(getServicesByCategories('all'))
                    setServiceModalVisible(false)
                }} getSelectedCategory={handleCategorySelection} searchValue={search} changeSearchValue={(value) => setSearch(value)} handleSearch={handleSearch}
                                              leaveInput={() => setServiceSearching(false)} closeSpaceModal={() => setServiceModalVisible(false)}
                                              startingSearch={() => setServiceSearching(true)} searching={serviceSearching}
                                              spaceModalVisible={serviceModalVisible}  showSpaceModal={()=>setServiceModalVisible(true)}/>,
                headerLeft: () =>
                    <AppAvatar
                        showNottif={true}
                        user={user}
                        onPress={() =>navigation.openDrawer()}/>
            }}/>
            <ServiceStackNav.Screen name='NewServiceScreen' component={NewServiceScreen} options={{
                title: 'Ajout nouveau service',
            }}/>

        </ServiceStackNav.Navigator>
    );
}

export default ServiceNavigator;