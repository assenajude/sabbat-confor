import React, {useState, useEffect} from 'react';
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import {Keyboard} from 'react-native'
import ElocationScreen from "../screens/ElocationScreen";
import colors from "../utilities/colors";
import UserLocationScreen from "../screens/UserLocationScreen";
import NewLocationScreen from "../screens/NewLocationScreen";
import CartIconRight from "../components/shoppingCart/CartIconRight";
import {useDispatch, useSelector, useStore} from "react-redux";
import routes from "./routes";
import AppTopBar from "../components/AppTopBar";
import AppAvatar from "../components/user/AppAvatar";
import {getLocationsByCategories, getLocationSearch} from "../store/slices/locationSlice";
import useMainFeatures from "../hooks/useMainFeatures";

const LocationStackNav = createStackNavigator()

function LocationNavigator({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const {getLocalisationLocations} = useMainFeatures()
    const user = useSelector(state => state.auth.user)
    const locationCategories = useSelector(state => {
        const allCategories = state.entities.categorie.list
        const newCategorieTab = allCategories.filter(categ => categ.typeCateg === 'location')
        return newCategorieTab
    })
    const cartItemLenght = useSelector(state => state.entities.shoppingCart.itemsLenght)
    const [searchValue, setSearchValue] = useState('')
    const [locationModalVisible, setLocationModalVisible] = useState(false)
    const [locationSearching, setLocationSearching] = useState(false)
    const [dataList, setDataList] = useState(locationCategories)
    const [toCategorie, setToCategorie] = useState(true)
    const [selectedVille, setSelectedVille] = useState()
    const [toLocalisation, setToLocalisation] = useState(false)

    const handleChangeSelection = () => {
       if(toCategorie) {
           setToCategorie(false)
           setToLocalisation(true)
           const locList = store.getState().entities.location.list
           const localisations = store.getState().entities.localisation.list
           const newData = []
           for(let i=0; i<locList.length; i++) {
               const selectedLocation = locList[i]
               const selectedLocalisation = localisations.find(item => item.id === selectedLocation.Localisation.id)
               if(i>0) {
                   const oldItem = locList[i-1]
                   if(oldItem.Localisation.VilleId === selectedLocation.Localisation.VilleId) {
                       let oldData = newData.pop()
                       const oldLocations = oldData.locations
                       const oldLocalisations = oldData.localisations
                       oldLocations.push(selectedLocation)
                       oldLocalisations.push(selectedLocalisation)
                       oldData.locations = oldLocations
                       oldData.localisations = oldLocalisations
                       newData[newData.length] = oldData
                   }else {
                       const ville = selectedLocalisation.Ville
                       const locations = [selectedLocation]
                       const localisations = [selectedLocation.Localisation]
                       newData.push({ville, locations, localisations})
                   }
               }else {
                   const ville = selectedLocalisation.Ville
                   const locations = [selectedLocation]
                   const localisations = [selectedLocalisation]
                   newData.push({ville, locations, localisations})
               }
           }
           setDataList(newData)
       }else {
           setToCategorie(true)
           setToLocalisation(false)
           setSelectedVille(null)
           setDataList(locationCategories)

       }
    }

    const handleLocationSearch = () => {
        dispatch(getLocationSearch(searchValue))
    }

    const hideLocationKeyboard =() => {
        setLocationSearching(false)
    }

    const handleCategorySelection = (category) => {
        if(toLocalisation && !selectedVille) {
            setSelectedVille(category)
            const validList = [...new Set(category.localisations)]
            setDataList(validList)
        }else {
            let data;
            if(toLocalisation) {
                data = {toLocalisation, locations: getLocalisationLocations(category.id)}
            }else{
                data = category
            }
            dispatch(getLocationsByCategories(data))
            setSelectedVille(null)
            setToCategorie(true)
            setDataList(locationCategories)
            setToLocalisation(false)
            setLocationModalVisible(false)

        }

    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidHide', hideLocationKeyboard)
        return () => {
            Keyboard.removeListener('keyboardDidHide', hideLocationKeyboard)
        }
    }, [])

    return (
        <LocationStackNav.Navigator screenOptions={{
            headerStyle: {backgroundColor: colors.rougeBordeau},
            headerTintColor: colors.blanc,
            headerTitleAlign: 'center',
            ...TransitionPresets.SlideFromRightIOS
        }}>
            <LocationStackNav.Screen name='LocationScreen' component={ElocationScreen} options={{
                headerLeft: () =>
                    <AppAvatar
                        user={user}
                        onPress={() =>navigation.openDrawer()}/>,
                headerTitle: () => <AppTopBar
                    toCategorie={toCategorie}
                    toLocalisation={toLocalisation}
                    handleSelection={handleChangeSelection}
                    espace='location'
                    getAllCategories={() => {
                    dispatch(getLocationsByCategories('all'))
                    setLocationModalVisible(false)
                }}
                    getSelectedCategory={handleCategorySelection}
                    categoryList={dataList}
                    searchValue={searchValue}
                    changeSearchValue={(val) => setSearchValue(val)}
                    handleSearch={handleLocationSearch}
                    spaceModalVisible={locationModalVisible}
                    showSpaceModal={() => setLocationModalVisible(true)}
                    searching={locationSearching}
                    startingSearch={() => setLocationSearching(true)}
                    closeSpaceModal={() => setLocationModalVisible(false)}
                    leaveInput={() => setLocationSearching(false)}/>,
                headerRight: () => <CartIconRight cartLenght={cartItemLenght} getToCartScreen={() =>navigation.navigate('AccueilNavigator', {screen: routes.CART})}/>
            }}/>
            <LocationStackNav.Screen name='UserLocationScreen' component={UserLocationScreen} options={{
                title: 'Vos location',
            }}/>
            <LocationStackNav.Screen name='NewLocationScreen' component={NewLocationScreen} options={{
                title: 'Nouvelle location',
            }}/>


        </LocationStackNav.Navigator>
    );
}

export default LocationNavigator;