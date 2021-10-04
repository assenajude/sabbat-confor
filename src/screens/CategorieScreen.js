import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector, useStore} from 'react-redux'
import {View, StyleSheet,Text, FlatList, Alert, ToastAndroid} from 'react-native';
import ListFooter from "../components/list/ListFooter";

import routes  from '../navigation/routes';
import CategorieItem from "../components/categorie/CategorieItem";
import {deleteOneCategorie} from "../store/slices/categorieSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useMainFeatures from "../hooks/useMainFeatures";
import AppItemPicker from "../components/AppItemPicker";
import useAuth from "../hooks/useAuth";


function CategorieScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const {getCategorieInfos} = useMainFeatures()
    const {userRoleAdmin} = useAuth()

    const categoriesData = useSelector(state => state.entities.categorie.list);
        const loading = useSelector(state => state.entities.categorie.loading);
    const serviceData = useSelector(state => state.entities.service.searchList)
    const mainData = useSelector(state => state.entities.main.searchList)
    const [selectedSpace, setSelectedSpace] = useState('tous')
    const [currentData, setCurrentData] = useState(categoriesData)

    const getcategorieProducts = (categorie) => {
        let params = {}
        if(categorie.typeCateg === 'service') {
            const selectedServices = serviceData.filter(service => service.CategorieId === categorie.id)
            params = selectedServices || []
            navigation.navigate("E-service", {screen: 'ServiceScreen',params:{products: params, headerTitle: categorie.libelleCateg}})
        }else {
            const selectedProd = mainData.filter(item => item.CategorieId === categorie.id)
            params = selectedProd || []
            navigation.navigate(routes.ACCUEIL,{products: params, headerTitle: categorie.libelleCateg})
        }
    }

    const handleDeleteCategorie = (categorie) => {
        Alert.alert("Attention", "Voulez-vous supprimer definitivement cette categorie?", [{
            text: 'oui', onPress: async () => {
                await dispatch(deleteOneCategorie({categorieId: categorie.id}))
                const error = store.getState().entities.categorie.error
                if(error !== null) return ToastAndroid.showWithGravity("Impossible de supprimer la categorie.", ToastAndroid.LONG, ToastAndroid.CENTER)
                ToastAndroid.showWithGravity("categorie supprimée avec succès.", ToastAndroid.LONG, ToastAndroid.CENTER)
            }
        }, {
            text: 'non', onPress: () => {return;}
        }])

    }

    const handleChangeSpace = () => {
        if(selectedSpace === 'e-commerce') {
            const newList = categoriesData.filter(item => item.typeCateg === 'article')
            setCurrentData(newList)
        }else if(selectedSpace === 'e-location') {
            const newList = categoriesData.filter(item => item.typeCateg === 'location')
            setCurrentData(newList)
        }else if(selectedSpace === 'e-service') {
            const newList = categoriesData.filter(item => item.typeCateg === 'service')
            setCurrentData(newList)
        }else {
            setCurrentData(categoriesData)
        }
    }

    useEffect(() => {
        handleChangeSpace()
    }, [selectedSpace])

return (
    <>
        <AppActivityIndicator visible={loading}/>
        <AppItemPicker
            selectedValue={selectedSpace}
            onValueChange={value => setSelectedSpace(value)}
            label='Trier par :'
            items={['Tous','e-commerce', 'e-location', 'e-service']}/>
           {currentData.length>0 &&
           <FlatList
                data={currentData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) =>
                    <CategorieItem
                        editCategorie={() => navigation.navigate(routes.NEW_CATEG, item)}
                        totalProduct={getCategorieInfos(item)?.categorieProduct?.productLength}
                        description={item.descripCateg}
                        libelle={item.libelleCateg}
                        secondPrice={getCategorieInfos(item)?.categorieProduct?.secondPrice}
                        firstPrice={getCategorieInfos(item)?.categorieProduct?.firstPrice}
                        source={{uri: item.imageCateg}}
                        deleteCategorie={() => handleDeleteCategorie(item)}
                        getcategorieProducts={() => getcategorieProducts(item)}
                    />}
            />}
            {categoriesData.length === 0 && <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <Text>Aucune categorie trouvee</Text>
            </View>
            }
        {userRoleAdmin() &&
            <ListFooter
                onPress={() => navigation.navigate(routes.NEW_CATEG)}/>
        }
    </>
)
}


export default CategorieScreen;