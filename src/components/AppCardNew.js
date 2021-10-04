import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Alert} from "react-native";
import LottieView from 'lottie-react-native'
import {useNavigation} from '@react-navigation/native'
import AppText from "./AppText";
import colors from "../utilities/colors";
import useAuth from "../hooks/useAuth";
import AppIconButton from "./AppIconButton";
import useMainFeatures from "../hooks/useMainFeatures";
import useManageUserOrder from "../hooks/useManageUserOrder";
import AddToCartButton from "./shoppingCart/AddToCartButton";
import {Card, Avatar} from "react-native-paper";
import useItemReductionPercent from "../hooks/useItemReductionPercent";
import {useSelector} from "react-redux";
import OrderHelpModal from "./OrderHelpModal";
import AppActivityIndicator from "./AppActivityIndicator";
import dayjs from "dayjs";
import routes from "../navigation/routes";

function AppCardNew({item={}, addToCart, viewDetails,deleteItem, editItem}) {
    const navigation = useNavigation()
    const {userRoleAdmin, formatPrice, formatDate} = useAuth()
    const {getPromoLeftTime, toggleFavorite} = useMainFeatures()
    const {secsToTime} = useManageUserOrder()
    const {getReductionPercent} = useItemReductionPercent()
    const userArticlesFavorites = useSelector(state => state.entities.userFavorite.articleFavoris)
    const userLocationsFavorites = useSelector(state => state.entities.userFavorite.locationFavoris)
    const user = useSelector(state => state.auth.user)
    const [currentTime, setCurrentTime] = useState(getPromoLeftTime(item.finFlash))
    const [isImageLoading, setIsImageLoading] = useState(true)
    const [helpModalVisible, setHelpModalVisible] = useState(false)
    const [visible, setVisible] = useState(false)

    const productType = item.Categorie.typeCateg
    const reductionPercent = productType !== 'service'?getReductionPercent(item) : null
    const userProductsFavorites = productType === 'article'?userArticlesFavorites : userLocationsFavorites
    const promotingItem = () => {
        let promoting = false
        if(productType !== 'service') promoting = item.flashPromo && dayjs(item.debutFlash)<=dayjs() && dayjs(item.finFlash)>dayjs()
        return promoting
    }

    const isItemFavorite = userProductsFavorites.some(fav => fav.id === item.id)
    const notInStock = productType === 'article'?item.qteStock <= 0 : productType === 'location'? item.qteDispo <= 0 : !item.isDispo

    const toggleItemFavorite = async () => {
        const isUser = Object.keys(user).length>0
        if(!isUser) {
            return  Alert.alert(
                "Alert",
                "Vous devez vous connecter pour ajouter le produit à vos favoris.",
                [
                    {
                        text: "Plutard",
                        onPress: () => {return;},
                        style: "cancel"
                    },
                    { text: "connexion", onPress: () => {navigation.navigate(routes.LOGIN)} }
                ]
            );
        }
        setVisible(true)
        await toggleFavorite(item)
        setVisible(false)
    }

    const nextPromo = item.flashPromo && dayjs(item.debutFlash)>dayjs()
    const flashEnded= item.flashPromo && dayjs(item.finFlash)<= dayjs()
    const notInPromo = nextPromo || flashEnded



  useEffect(() => {
      const promoTimer = setInterval(() => {
          const newTime = getPromoLeftTime(item.finFlash)
          setCurrentTime(newTime)
      }, 1000)
      return () => clearInterval(promoTimer)
  }, [])
    return (
        <>
            <AppActivityIndicator visible={visible}/>
        <Card
            mode='elevated'
            onPress={!notInStock && !notInPromo?viewDetails : null}
            elevation={5} style={styles.card}>
            {promotingItem() && <Card.Title
                subtitleStyle={{alignSelf: 'center', color: colors.rougeBordeau}}
                subtitle={secsToTime(currentTime)}
            />}
            <Card.Cover
                onLoadEnd={() => setIsImageLoading(false)}
                style={[styles.cover, {marginTop: promotingItem()?0 : 40}]}
                source={{uri: productType==='article'?item.imagesArticle[0]:productType==='location'?item.imagesLocation[0] : item.imagesService[0]}}/>
            {isImageLoading &&
            <View style={styles.imageLoading}>
                <LottieView
                    lottieStyle={{
                        height: 100,
                        width: 300,
                    }}
                    source={require('../assets/animations/image-loading')}
                    loop={true}
                    autoPlay={true}/>
            </View>}
                {reductionPercent>0  &&
            <Avatar.Text
                style={styles.percent}
                labelStyle={styles.percentText}
                label={`-${reductionPercent}%`} size={40}/>
            }
            {productType !== 'service' &&
            <View style={styles.aideAndFavorite}>
                <AppIconButton
                    iconSize={30}
                    onPress={() => setHelpModalVisible(true)}
                    iconName='information'
                />
                <AppIconButton
                    iconSize={30}
                    onPress={toggleItemFavorite}
                    iconName={isItemFavorite?'heart':'heart-outline'}
                />
            </View>}
                <Card.Title
                title={productType === 'article'?item.designArticle : productType === 'location'? item.libelleLocation : item.libelle}
                subtitle={productType === 'article'?item.descripArticle : productType === 'location'? item.descripLocation : item.description}
                subtitleNumberOfLines={2}
            />
            {productType !=='service' &&
            <View style={styles.title}>
                    <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>{formatPrice(productType === 'article'?item.prixPromo : item.coutPromo)}</AppText>
                    <AppText style={styles.secondTitle}>{formatPrice(productType === 'article'?item.prixReel : item.coutReel)}</AppText>
                {productType === 'location' && <AppText>/{item.frequenceLocation.toLowerCase() === 'mensuelle'?'Mois' : 'Jour'}</AppText>}
            </View>}
            {productType === 'service' &&
            <View style={styles.title}>
                    <AppText>{formatPrice(item.montantMin)}</AppText>
                <AppText> - </AppText>
                    <AppText>{formatPrice(item.montantMax)}</AppText>
            </View>}
            <Card.Actions style={styles.actions}>
                <AddToCartButton
                    onPress={addToCart}
                    label={productType === 'article'?'Acheter' : productType === 'location'?'Louer' : 'Demander'}/>
            </Card.Actions>
            {notInPromo &&
            <View  style={styles.promo}>
                {nextPromo &&
                <View>
                    <AppText style={{fontWeight: 'bold'}}>Flash promo du</AppText>
                    <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>{formatDate(item.debutFlash)}</AppText>
                    <AppText style={{fontWeight: 'bold'}}>au</AppText>
                    <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>{formatDate(item.finFlash)}</AppText>
                </View>}
                {flashEnded && <View style={{
                    marginTop: 100
                }}>
                    <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>Flash promo terminé.</AppText>
                </View>}
            </View>}
            {notInStock && <View style={styles.notInStock}>
                {productType !== 'service' && <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>Rupture de stock</AppText>}
                {productType === 'service' && <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>Service non disponible</AppText>}
            </View>}
            {userRoleAdmin() && <View style={{
                flexDirection: 'row',
                alignSelf: 'center'
            }}>
                <AppIconButton
                    iconColor={colors.blanc}
                    iconName='delete-forever'
                    buttonContainer={{
                        backgroundColor: colors.rougeBordeau
                    }}
                    onPress={deleteItem}
                />
                <AppIconButton
                    iconColor={colors.blanc}
                    iconName='circle-edit-outline'
                    onPress={editItem}
                    buttonContainer={{
                        marginLeft: 30,
                        backgroundColor: colors.bleuFbi
                    }}
                />
            </View>}
        </Card>
            {productType !== 'service' && <OrderHelpModal
                selectedSource={{uri: productType === 'article'?item.imagesArticle[0] : item.imagesLocation[0]}}
                closeModal={() => setHelpModalVisible(false)}
                visible={helpModalVisible}/>}
        </>
    );
}

const styles = StyleSheet.create({
    notInStock: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        opacity: 0.6,
        zIndex: 1,
        backgroundColor: colors.blanc
    },
    percent: {
        position: 'absolute',
        left: 5,
        top: 5,
        backgroundColor: colors.blanc
    },
    imageLoading: {
      position: 'absolute',
      width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      height:250,
        backgroundColor: colors.blanc
    },
    percentText: {
        fontSize: 15,
        color: colors.rougeBordeau
    },
    promo: {
        height: '100%',
        width: '100%',
        backgroundColor: colors.blanc,
        position: 'absolute',
        opacity: 0.8,
        paddingBottom: -20
    },
    secondTitle: {
        textDecorationLine: 'line-through'
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
      marginHorizontal: 10
    },
    card: {
        backgroundColor: colors.blanc,
        marginVertical: 20,
        marginHorizontal: 10
    },
    cover: {
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.blanc,
    },
    actions: {
        justifyContent: 'center',
        marginVertical: 20
    },
    aideAndFavorite: {
        position: 'absolute',
        right: 5,
        top: -5,
        flexDirection: 'row',
        alignItems: 'center'
    }
})
export default AppCardNew;