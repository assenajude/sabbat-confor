import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, View, StyleSheet,TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import { EvilIcons } from '@expo/vector-icons';

import colors from "../utilities/colors";
import {useDispatch, useSelector, useStore} from "react-redux";
import AppText from "../components/AppText";
import AppIconButton from "../components/AppIconButton";
import routes from "../navigation/routes";
import HomeCard from "../components/HomeCard";
import useMainFeatures from "../hooks/useMainFeatures";
import {getSelectedOptions} from "../store/slices/mainSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useNotification from "../hooks/useNotification";
import {getSaveEditInfo} from "../store/slices/userProfileSlice";
import ScrollHeaderComponent from "../components/ScrollHeaderComponent";
import useAuth from "../hooks/useAuth";

function HomeScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const {registerForPushNotificationsAsync} = useNotification()
    const {getStarted} = useAuth()
    const {getProductsByCategories, getBestSellerArticles, getFlashPromo, isProductAvailble} = useMainFeatures()
    const user = useSelector(state => state.auth.user)
    const cartLoading = useSelector(state => state.entities.shoppingCart.loading)
    const mainDatas = useSelector(state => {
        const list = state.entities.main.list
        const newList = []
        list.forEach(prod => {
            const isAvailable = isProductAvailble(prod)
            if(isAvailable) newList.push(prod)
        })
        return newList
    })
    const refreshNotif = useSelector(state => state.entities.main.homeCounter)
    const mainLoading = useSelector(state => state.entities.main.loading)
    const categLoading = useSelector(state => state.entities.categorie.loading)
    const [isHotSelected, setIsHotSelected] = useState(true)
    const [isAllSelected, setIsAllSelected] = useState(false)
    const [pushLoading, setPushLoading] = useState(false)
    const mustRefresh = refreshNotif>0 || getProductsByCategories().length === 0 || mainDatas.length === 0



    const getToken = useCallback(async () => {
        setPushLoading(true)
        const token = await registerForPushNotificationsAsync()
        setPushLoading(false)
        const profileNotifToken = store.getState().profile.connectedUser.pushNotificationToken
        const isTheSameToken =  profileNotifToken === token
        if(isTheSameToken) return;
        else if(Object.keys(user)>0) dispatch(getSaveEditInfo({userId: user.id, pushNotificationToken: token}))
    }, [])


    useEffect(() => {
        getToken()
        const unsubscribe = navigation.addListener('focus',() => {
            setIsHotSelected(true)
            setIsAllSelected(false)
        } )
        return unsubscribe
    }, []);

    return (
        <>
            <AppActivityIndicator  visible={cartLoading || mainLoading || categLoading || pushLoading}/>
            <ScrollView
            contentContainerStyle={{
                paddingBottom: 30,
                backgroundColor: colors.blanc
            }}
            stickyHeaderIndices={[0]}
        >
            <ScrollHeaderComponent/>
            <View style={styles.headerStyle}>
                <View style={styles.headerInfo}>
                    <AppText style={{color: colors.or, fontSize: 15, marginLeft: 40, fontWeight: 'bold'}}>sabbat-confort</AppText>
                    <AppText style={{marginTop: -10, fontSize: 24, color: colors.blanc}}>Tout le confort à portée de main.</AppText>
                </View>
                <View style={styles.secondHeader}>
                </View>
               {mustRefresh && <TouchableOpacity onPress={() => getStarted()} style={styles.refresh}>
                    <EvilIcons name="refresh" size={40} color={colors.bleuFbi} />
                    {refreshNotif>0 && <AppText style={styles.notif}>{refreshNotif}</AppText>}
                </TouchableOpacity>}
            </View>
            <View style={{
                position: 'absolute',
                top: 230
            }}>
            <View>
                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 20
                    }}
                    horizontal={true}>
                    {getProductsByCategories().slice(0,10).map((item, index) =>
                        <HomeCard
                            getProductLink={() => navigation.navigate(routes.ACCUEIL, {...item, headerTitle: item.Categorie.libelleCateg})}
                            getProductDetails={() => navigation.navigate(routes.ACCUEIL, {...item, headerTitle: item.Categorie.libelleCateg})}
                            firstPrice={item.firstPrice}
                            secondPrice={item.secondPrice}
                            key={index.toString()}
                            item={item}
                            productLength={item.productLength}
                        />
                    )}
                </ScrollView>
                {getProductsByCategories().length === 0 &&
                <View style={styles.loadingCategorie}>
                    <AppText>Aucune categories trouvée.</AppText>
                </View>}
            </View>
            </View>
            <View style={styles.contentStyle}>
                <AppText
                    onPress={() => {
                        setIsHotSelected(true)
                        setIsAllSelected(false)
                    }}
                    style={{
                        fontWeight: isHotSelected?'bold':'normal',
                        color: isHotSelected?colors.bleuFbi :'#4e4e4e',
                        textDecorationLine: isHotSelected? 'none' : 'underline'
                    }} >shap-shap</AppText>
                <AppText
                    onPress={() => {
                        setIsAllSelected(true)
                        setIsHotSelected(false)
                        navigation.navigate(routes.ACCUEIL, {all: true, headerTitle: 'Tous les produits'})
                    }}
                    style={{
                        fontWeight: isAllSelected?'bold':'normal',
                        color: isAllSelected?colors.bleuFbi :'#4e4e4e',
                        textDecorationLine: isAllSelected? 'none' : 'underline'
                    }}>Voir tout</AppText>
            </View>
            <View style={{
                marginVertical: 20
            }}>
                {mainDatas.length>0 && <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 20
                    }}
                    horizontal={true}>
                    {mainDatas.map((item, index) =>
                        <HomeCard
                            getProductDetails={() => {
                                dispatch(getSelectedOptions(item))
                                navigation.navigate('AccueilNavigator',{screen:item.Categorie.typeCateg === 'article'?routes.ARTICLE_DETAIL : routes.LOCATION_DETAIL, params: item})
                            }}
                            descripLineNumber={3}
                            showCategorie={false}
                            key={index.toString()}
                            item={item}/>
                    )}
                </ScrollView>}
                {mainDatas.length ===0 &&  <AppText>Aucun produit trouvé.</AppText>}
            </View>
            <View>
                <View style={styles.infoCardContainer}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate(routes.ACCUEIL, {products: getBestSellerArticles(),headerTitle: 'Best seller'})}>
                    <View style={[styles.infoCard, {backgroundColor: 'orange'}]}>
                        <AppIconButton
                            iconColor={colors.bleuFbi}
                            onPress={() => navigation.navigate(routes.ACCUEIL, {products: getBestSellerArticles(),headerTitle: 'Best seller'})}
                            buttonContainer={styles.infoCardIcon}
                            iconSize={24}
                            iconName='chevron-double-right'/>
                        <AppText style={styles.infoText}>Mieux vaut tard que jamais.</AppText>
                        <AppText style={[styles.secondTextInfo, {marginTop: -10}]}>Nos meilleurs ventes.</AppText>
                    </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate(routes.ACCUEIL, {products: getFlashPromo().currentFlash, headerTitle: 'Vente Flash du jour'})}>
                    <View style={[styles.infoCard, {backgroundColor: 'green'}]}>
                        <AppIconButton
                            iconColor={colors.bleuFbi}
                            onPress={() => navigation.navigate(routes.ACCUEIL, {products: getFlashPromo().currentFlash, headerTitle: 'Vente Flash du jour'})}
                            buttonContainer={styles.infoCardIcon}
                            iconSize={24}
                            iconName='chevron-double-right'/>
                        <AppText style={styles.infoText}>Ajourd'hui ou jamais!</AppText>
                        <AppText style={styles.secondTextInfo}>Les Ventes flash courants.</AppText>
                    </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.infoCardContainer}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate(routes.ACCUEIL,
                        {products: getFlashPromo().otherFlash, headerTitle: 'Vente Flash à venir'})}>
                    <View style={[styles.infoCard, {backgroundColor: 'green'}]}>
                        <AppIconButton
                            iconSize={24}
                            iconColor={colors.bleuFbi}
                            onPress={() => navigation.navigate(routes.ACCUEIL,
                                {products: getFlashPromo().otherFlash, headerTitle: 'Vente Flash à venir'})}
                            buttonContainer={styles.infoCardIcon}
                            iconName='chevron-double-right'/>
                        <AppText style={styles.infoText}>Croire en l'avenir!</AppText>
                        <AppText style={styles.secondTextInfo}>Les ventes flash à venir.</AppText>
                    </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('OtherMain',{screen: routes.CATEGORIE})}>
                    <View style={[styles.infoCard, {backgroundColor: 'orange'}]}>
                        <AppText style={styles.infoText}>Qui dit mieux?</AppText>
                        <AppText style={styles.secondTextInfo}>Consulter toutes les categories</AppText>
                        <AppIconButton
                            iconColor={colors.bleuFbi}
                            iconSize={24}
                            onPress={() => navigation.navigate('OtherMain',{screen: routes.CATEGORIE})}
                            buttonContainer={styles.infoCardIcon}
                            iconName='chevron-double-right'/>
                    </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </ScrollView>

        </>
    );
}

const styles = StyleSheet.create({
    categorieList: {
      position: 'absolute',
        top: 100
    },
    contentStyle: {
      marginTop: 170,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    headerStyle: {
        height: 360,
        width: '100%',
        backgroundColor: colors.rougeBordeau
    },
    headerInfo: {
        alignItems: 'flex-start',
        marginHorizontal: 20,
        width: 245,
        position: 'absolute',
        top: 10,
        left: 70
    },
    notif: {
      position: 'absolute',
        fontSize: 15,
      right: -10,
      top: -40,
        color: colors.blanc
    },
    secondHeader: {
        width: 0,
        height: 0,
        backgroundColor:colors.rougeBordeau,
        borderStyle: "solid",
        borderRightWidth: 180,
        borderTopWidth: 180,
        borderRightColor: "transparent",
        borderTopColor: colors.leger,
        position: 'absolute',
        bottom: 0,
        left: 0,
        transform: [{ rotate: "270deg" }]
    },
    infoCard: {
        minHeight: 120,
        minWidth: 120,
        maxHeight: 180,
        maxWidth: 170,
        borderRadius: 10
    },
    infoCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: 30,

    },
    infoCardIcon: {
        position: 'absolute',
        height:40,
        width: 40,
        borderRadius: 20,
        right: 0,
        bottom: 0,
        backgroundColor: colors.blanc
    },
    infoText:{
        fontSize: 18,
        color: colors.blanc,
        marginTop: 5,
    },
    refresh: {
      position: 'absolute',
      left: 20,
      top: 100,
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: colors.blanc
    },
    loadingCategorie: {
        position: 'absolute',
        width: 500,
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 335,
        backgroundColor: colors.leger,
        paddingLeft: 20
    },
    secondTextInfo:{
        color: colors.blanc,
        fontSize: 15,
        marginTop: -10
    }
})
export default HomeScreen;