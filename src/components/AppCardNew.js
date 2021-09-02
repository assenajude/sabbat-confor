import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity} from "react-native";
import AppText from "./AppText";
import colors from "../utilities/colors";
import useAuth from "../hooks/useAuth";
import AppLottieViewAnim from "./AppLottieViewAnim";
import AppIconButton from "./AppIconButton";
import useMainFeatures from "../hooks/useMainFeatures";
import useManageUserOrder from "../hooks/useManageUserOrder";
import AddToCartButton from "./shoppingCart/AddToCartButton";

function AppCardNew({source, description, itemReductionPercent, isFavorite, titleLabel,itemType,editItem,
                        toggleFavorite, aideInfo,firstTitle, secondTitle, notInStock, deleteItem,flashEnded,promoting,
                        addToCart, viewDetails, minAmount, maxAmount, showHelpInfo, nextPromo, debutPromo, finPromo}) {
    const {userRoleAdmin, formatPrice, formatDate} = useAuth()
    const {secsToTime} = useManageUserOrder()

    const {getPromoLeftTime} = useMainFeatures()
    const [currentTime, setCurrentTime] = useState(getPromoLeftTime(finPromo))
    const notInPromo = nextPromo || flashEnded
    const [isImageLoading, setIsImageLoading] = useState(true)


  useEffect(() => {
      const promoTimer = setInterval(() => {
          const newTime = getPromoLeftTime(finPromo)
          setCurrentTime(newTime)
      }, 1000)
      return () => clearInterval(promoTimer)
  }, [])
    return (
        <View style={styles.container}>
                {promoting && <AppText style={{color: colors.or, fontSize: 13}}>{secsToTime(currentTime)}</AppText>}
            <View>
                <View>
                <TouchableWithoutFeedback onPress={viewDetails}>
                    <Image
                        onLoadEnd={() => setIsImageLoading(false)}
                        resizeMode='contain'
                        style={styles.imageStyle}
                        source={source}/>
                </TouchableWithoutFeedback>
                    {isImageLoading &&
                    <View style={styles.imageLoading}>
                        <AppLottieViewAnim
                            lottieStyle={{
                                height: 200,
                                width: 200,
                                left: -30,
                                top:20,
                            }}
                            lottieSource={require('../assets/animations/image-loading')}
                            lottieLoop={true}
                            lottieAutoPlay={true}/>
                    </View>}
                </View>
                <View>
                <View style={styles.description}>
                    <AppText lineNumber={2}>{description}</AppText>
                </View>
                 {itemType !=='service' && <View style={styles.title}>
                        <AppText style={{fontWeight: 'bold'}}>{titleLabel}</AppText>
                     <View>
                            <AppText style={{color: colors.rougeBordeau}}>{formatPrice(firstTitle)}</AppText>
                            <AppText style={styles.secondTitle}>{formatPrice(secondTitle)}</AppText>
                     </View>
                 </View>}
                 {itemType === 'service' && <View style={{
                     alignItems: 'center'
                 }}>
                     <View style={{
                         flexDirection: 'row'
                     }}>
                         <AppText style={{fontWeight: 'bold'}}>Minimum:</AppText>
                         <AppText>{formatPrice(minAmount)}</AppText>
                     </View>

                     <View style={{
                         flexDirection: 'row'
                     }}>
                         <AppText style={{fontWeight: 'bold'}}>Maximum:</AppText>
                         <AppText>{formatPrice(maxAmount)}</AppText>
                     </View>
                 </View>}
                 <AddToCartButton
                     style={{
                         alignSelf: 'center',
                         marginVertical: 20
                     }}
                     onPress={addToCart}
                     label={itemType === 'location'?'Louer' : itemType === 'service'?'Utiliser': 'Acheter'}
                 />
                </View>
            </View>
            {itemType !== 'service' && itemReductionPercent>0  && <View style={styles.percent}>
                <AppText style={styles.percentText}>-{itemReductionPercent}%</AppText>
            </View>}
            {itemType !== 'service' &&
                <AppIconButton
                    iconSize={30}
                    iconColor={colors.dark}
                    onPress={toggleFavorite}
                    buttonContainer={styles.favorite}
                    iconName={isFavorite?'heart':'heart-outline'}
                    />}
            {itemType !== 'service' && aideInfo &&
                <AppIconButton
                    iconSize={30}
                    onPress={showHelpInfo}
                    iconName='information'
                    iconColor={colors.dark}
                    buttonContainer={styles.aide}/>
            }
            {notInStock && <View style={styles.notInStock}>
                {itemType !== 'service' && <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>Rupture de stock</AppText>}
                {itemType === 'service' && <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>Service non disponible</AppText>}
                {userRoleAdmin() && <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <AppIconButton
                        iconName='delete-forever'
                        buttonContainer={{
                            backgroundColor: colors.rougeBordeau
                        }}
                        onPress={deleteItem}
                    />
                    <AppIconButton
                        iconName='circle-edit-outline'
                        onPress={editItem}
                        buttonContainer={{
                            marginLeft: 30,
                            backgroundColor: colors.bleuFbi
                        }}
                    />
                </View>}
            </View>}
            {notInPromo && <View  style={styles.promo}>
                {nextPromo && <View style={{
                    marginTop: 100
                }}>
                    <AppText style={{fontWeight: 'bold'}}>Flash promo du</AppText>
                    <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>{formatDate(debutPromo)}</AppText>
                    <AppText style={{fontWeight: 'bold'}}>au</AppText>
                    <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>{formatDate(finPromo)}</AppText>
                </View>}
                {flashEnded && <View style={{
                    marginTop: 100
                }}>
                    <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>Flash promo terminé.</AppText>
                </View>}
            </View>}
            {userRoleAdmin() && <View style={{
                alignItems: 'center',
                alignSelf: 'center',
                flexDirection: 'row',
                marginVertical: 10
            }}>
                <AppIconButton
                    iconColor={colors.blanc}
                    buttonContainer={{
                        backgroundColor: colors.rougeBordeau,
                    }}
                    iconName='delete-forever'
                    onPress={deleteItem}/>
                <AppIconButton
                    iconColor={colors.blanc}
                    buttonContainer={{
                        backgroundColor: colors.bleuFbi,
                        marginLeft: 30
                    }}
                    iconName='circle-edit-outline'
                    onPress={editItem}
                />
            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    aide: {
        position: 'absolute',
        right: 80,
        top: 5,
        marginHorizontal: 20
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 10,
    },
    bottomInfo: {
      flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        marginHorizontal: 20,
        marginVertical: 10
    },
    container: {
        alignSelf: 'center',
      justifyContent: 'flex-start',
        width:360,
        height: 'auto',
        marginVertical: 15,
        backgroundColor: colors.blanc,
        padding: 5,
        borderRadius:10,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 10
    },
    description: {
        width: '80%',
        marginTop: -5,
        alignSelf: 'center'
    },
    favorite:{
        position: 'absolute',
        right: 10,
        top: 5,
        marginHorizontal: 20
    },
    imageStyle: {
        height: 250,
        width: 350,
        overflow: 'hidden',
        marginVertical: 20,
        top: 20
    },
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
    percent:{
        position:'absolute',
        left: 10,
        top:10,
        marginHorizontal: 20
    },
    imageLoading: {
      position: 'absolute',
      width: 350,
      height: 300,
        backgroundColor: colors.blanc
    },
    percentText: {
        color: colors.rougeBordeau,
        fontSize: 18
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
        textDecorationLine: 'line-through',
        marginTop: -10
    },
    title: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
})
export default AppCardNew;