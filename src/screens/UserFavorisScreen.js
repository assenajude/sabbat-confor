import React, {useEffect, useCallback} from 'react';
import {View, FlatList, Image, TouchableOpacity, StyleSheet} from 'react-native'
import {useDispatch, useSelector, useStore} from "react-redux";
import AppText from "../components/AppText";
import colors from "../utilities/colors";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {getToggleFavorite, getUserFavoris} from "../store/slices/userFavoriteSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";
import {getUserCompterReset} from "../store/slices/userProfileSlice";

function UserFavorisScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()

    const connectedUser = useSelector(state => state.profile.connectedUser)
    const error = useSelector(state => state.entities.userFavorite.error)
    const useFavorites = useSelector(state => {
        const formatedFav = []
        const articleFav = state.entities.userFavorite.articleFavoris
        const locationFav = state.entities.userFavorite.locationFavoris
        const allFav = [...articleFav, ...locationFav]
        allFav.forEach(fav => {
            const favImage =  fav.imagesArticle?fav.imagesArticle[0] : fav.imagesLocation[0]
            formatedFav.push({
                id: fav.id,
                libelle: fav.designArticle || fav.libelleLocation,
                image: favImage,
                prix: fav.prixPromo || fav.coutPromo,
                prixReel: fav.prixReel || fav.coutReel,
                type: fav.articles_favoris?'article':'location'
            })
        })
        return formatedFav
    })
    const loading = useSelector(state => state.entities.userFavorite.loading)


    const removefromFavorite = (item) => {
        dispatch(getToggleFavorite(item))
    }

    const handleOrderFav = (fav) => {
        if(fav.type === 'article') {
            navigation.navigate('AccueilNavigator', {screen: routes.ARTICLE_DETAIL, params: {...fav, designArticle: fav.libelle}})
        } else {
            navigation.navigate('AccueilNavigator', {screen: routes.LOCATION_DETAIL, params: {...fav, libelleLocation: fav.libelle}})
        }

    }

    const getStarted = useCallback(async () => {
        if(connectedUser.favoriteCompter > 0) {
            await dispatch(getUserFavoris())
            const error = store.getState().entities.userFavorite.error
            if(error !== null) return;
            const user = store.getState().auth.user
            dispatch(getUserCompterReset({userId: user.id, favoriteCompter: true}))
        }
    }, [])

    useEffect(() => {
        if(connectedUser.favoriteCompter > 0 || Object.keys(connectedUser).length>0) {
            getStarted()
        }
    }, [])

    if(!loading && useFavorites.length === 0) {
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <AppText>Vous n'avez aucun favoris...</AppText>
        </View>
    }

    if(!loading && error !== null) {
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <AppText>Impossible de consulter vos favoris, une erreur est apparue</AppText>
            <AppButton style={{width: 300}} title='recharger' onPress={getStarted}/>
        </View>
    }

    return (
        <>
            <AppActivityIndicator visible={loading}/>
        <FlatList data={useFavorites} keyExtractor={(item, index) => index.toString()}
                 renderItem={({item}) =>
                     <View
                         style={styles.favItem}>
                     <View style={{
                         overflow: 'hidden'
                     }}>
                         <View style={{
                             alignSelf: 'flex-end',
                             margin: 10,
                         }}>
                         <TouchableOpacity onPress={() => removefromFavorite(item)}>
                              <MaterialCommunityIcons name='heart' size={30}/>
                         </TouchableOpacity>
                         </View>
                     <Image source={{uri: item.image}} style={{width: '100%', height: 200}}/>
                         <AppText style={{fontWeight: 'bold'}}>{item.libelle}</AppText>
                     </View>
                     <View style={{
                         flexDirection: 'row'
                     }}>
                         <AppText style={{fontWeight: 'bold'}}>Prix: </AppText>
                         <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}> {item.prix}</AppText>
                         <AppText> / </AppText>
                         <AppText style={{
                             textDecorationLine: 'line-through'
                         }}>{item.prixReel}</AppText>
                         <AppText> fcfa </AppText>
                     </View>
                     <AppButton
                         style={{
                             alignSelf: 'center',
                             marginVertical: 20,
                             width: 200
                         }}
                        iconName='cart'
                         title='commander'
                         onPress={() => handleOrderFav(item)}/>
                 </View>
                 }/>
                 </>
    );
}

const styles = StyleSheet.create({
    favItem: {
        marginVertical: 20,
        marginHorizontal:10,
        borderRadius:10,
        backgroundColor: colors.blanc,
        paddingVertical: 20}
})
export default UserFavorisScreen;