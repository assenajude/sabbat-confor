import React, {useState}  from 'react';
import {Image, View, StyleSheet, TouchableWithoutFeedback, Alert} from "react-native";
import LottieView from 'lottie-react-native'
import AppText from "./AppText";
import AppIconButton from "./AppIconButton";
import colors from "../utilities/colors";
import useAuth from "../hooks/useAuth";
import {useDispatch, useSelector} from "react-redux";
import useItemReductionPercent from "../hooks/useItemReductionPercent";
import AddToCartModal from "./shoppingCart/AddToCartModal";
import {getSelectedOptions} from "../store/slices/mainSlice";
import routes from "../navigation/routes";
import useAddToCart from "../hooks/useAddToCart";
import {useNavigation} from '@react-navigation/native'
import AddToCartButton from "./shoppingCart/AddToCartButton";
import AppActivityIndicator from "./AppActivityIndicator";
import useMainFeatures from "../hooks/useMainFeatures";

function HomeCard({item, showCategorie=true, descripLineNumber=2,
                       getProductLink, productLength,
                      firstPrice, secondPrice, getProductDetails}) {
    const {formatPrice} = useAuth()
    const navigation = useNavigation()
    const {getReductionPercent} = useItemReductionPercent()
    const {addItemToCart} = useAddToCart()
    const {toggleFavorite} = useMainFeatures()
    const dispatch = useDispatch()
    const articleFavorites = useSelector(state => state.entities.userFavorite.articleFavoris)
    const locationFavorites = useSelector(state => state.entities.userFavorite.locationFavoris)
    const user = useSelector(state => state.auth.user)

    const [addToCartModalVisible, setAddToCartModalVisible] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const [favVisible, setFavVisible] = useState(false)

    const getItemFavoriteTab = (type) => {
        if(type === 'article')return articleFavorites
        else return locationFavorites
    }

    const handleAddToCart = async () => {
        if(item.ProductOptions.length > 1) {
            dispatch(getSelectedOptions(item))
            navigation.navigate('AccueilNavigator',{screen: item.Categorie.typeCateg === 'article'?routes.ARTICLE_DETAIL : routes.LOCATION_DETAIL, params: item})
        }else {
            const result = await addItemToCart(item)
            if(result) setAddToCartModalVisible(true)
        }
    }

    const imageSource = {uri:item.Categorie.typeCateg === 'article'? item?.imagesArticle[0] : item?.imagesLocation[0]}


    const handleToggleFavorite = async () => {
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
        setFavVisible(true)
        await toggleFavorite(item)
        setFavVisible(false)
    }

    return (
        <>
            <AppActivityIndicator visible={favVisible}/>
        <View  style={styles.headerImageContainer}>
        <TouchableWithoutFeedback onPress={getProductDetails}>
        <View>
            <View style={styles.imageContainer}>
                <Image
                    onLoadEnd={() => setImageLoading(false)}
                    resizeMode='contain'
                    style={styles.headerImage}
                    source={imageSource}/>
                    {imageLoading && <View style={{
                        width:240,
                        height: 150,
                        backgroundColor: colors.leger,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute'
                    }}>
                        <LottieView
                            loop={true}
                            autoPlay={true}
                            style={{height: 100, width: 100}}
                            source={require('../assets/animations/image-loading')}
                        />
                    </View>
                  }
            </View>
            <View style={styles.imageSecondContainer}>
                <AppText lineNumber={1} style={{fontSize: 20}}>{item.Categorie.typeCateg === 'article'?item.designArticle : item.libelleLocation}</AppText>
                {!showCategorie && <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                <AppText
                    style={{fontWeight: 'bold', marginTop: -5, fontSize: 15}}>
                    {item.Categorie.typeCateg === 'article'?formatPrice(item.prixPromo) : formatPrice(item.coutPromo)}
                </AppText>
                    <AppText
                        style={{textDecorationLine: 'line-through', fontSize: 15}}>
                        {item.Categorie.typeCateg === 'article'?formatPrice(item.prixReel) : formatPrice(item.coutReel)}
                    </AppText>
                </View>}
                {showCategorie && <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <AppText style={{fontSize: 15, fontWeight: 'bold'}}>{formatPrice(firstPrice)}</AppText>
                    {firstPrice !== secondPrice && <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                    <AppText>-</AppText>
                    <AppText style={{fontWeight: 'bold', fontSize: 15}}>{formatPrice(secondPrice)}</AppText>
                    </View>}
                </View>}
                <AppText lineNumber={descripLineNumber} style={{fontSize: 15, marginTop: -5}}>{item.Categorie.typeCateg === 'article'?item.descripArticle : item.descripLocation}</AppText>
                {showCategorie && <View style={styles.libelleContainer}>
                    <AppText style={{fontSize: 15}}>({productLength})</AppText>
                    <AppText lineNumber={1} onPress={getProductLink} style={styles.libelle}>{item.Categorie.libelleCateg}</AppText>
                </View>}
            </View>
            {!showCategorie && <AppIconButton
                iconColor={colors.dark}
                iconSize={30}
                onPress={handleToggleFavorite}
                buttonContainer={styles.favIcon}
                iconName={getItemFavoriteTab(item.Categorie.typeCateg).some(article => article.id === item.id)?'heart':'heart-outline'}
            />}
            {!showCategorie && getReductionPercent(item)>0 && <View style={{
                position: 'absolute',
                left: 5,
                top: 2
            }}>
                <AppText style={{
                    fontSize: 15,
                    backgroundColor: colors.blanc,
                    color: colors.rougeBordeau
                }}>-{getReductionPercent(item)}%</AppText>
            </View>}
        </View>
        </TouchableWithoutFeedback>
           {!showCategorie &&
               <AddToCartButton
                   onPress={handleAddToCart}
                   label={item.Categorie.typeCateg === 'article'?'Acheter' : 'Louer'}
               />}
        </View>
            {addToCartModalVisible && <AddToCartModal
                cartTop={0}
                cartHeight={'100%'}
                designation={item?.Categorie?.typeCateg === 'article'?item.designArticle : item.libelleLocation}
                source={{uri: item?.Categorie?.typeCateg === 'article'?item.imagesArticle[0] : item.imagesLocation[0]}}
                goToShoppingCart={() => {
                    setAddToCartModalVisible(false)
                    navigation.navigate(routes.CART)
                }}
                goToHomeScreen={() => setAddToCartModalVisible(false)}
                itemModalVisible={addToCartModalVisible}/>}
            </>
    );
}

const styles = StyleSheet.create({
    favIcon: {
        position: 'absolute',
        top: 2,
        right: 5,
        height: 30,
        width: 30,
        borderRadius: 15
    },
    headerImage: {
        height: 120,
        width: 150,
        overflow: 'hidden'
    },
    headerImageContainer: {
        marginHorizontal: 5,
        height: "auto",
        width: 240,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    imageContainer: {
        width: 240,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.leger,
        borderTopLeftRadius:10,
        borderTopRightRadius: 10
    },
    imageSecondContainer: {
        height:'auto',
        width: 240,
        minWidth: 200,
        paddingBottom:10,
        alignItems: 'flex-start',
        backgroundColor: colors.blanc,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingLeft: 5
    },
    libelle: {
        fontWeight: 'bold',
        fontSize: 15,
        color: colors.bleuFbi,
        width: 190
    },
    libelleContainer: {
        flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 10
    }
})
export default HomeCard;