import React, {useState} from 'react';
import {View, StyleSheet, Image, TouchableWithoutFeedback} from "react-native";
import LottieView from 'lottie-react-native'
import AppText from "../AppText";
import colors from "../../utilities/colors";
import useAuth from "../../hooks/useAuth";
import AppIconButton from "../AppIconButton";

function CategorieItem({source,libelle,firstPrice, secondPrice,editCategorie,
                           description, totalProduct, getcategorieProducts, deleteCategorie}) {
    const {formatPrice, userRoleAdmin} = useAuth()

    const [imageLoading, setImageLoading] = useState(true)



    return (
        <TouchableWithoutFeedback onPress={getcategorieProducts}>
        <View style={styles.container}>
            <View style={{
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Image
                    onLoadEnd={() => setImageLoading(false)}
                    resizeMode='contain'
                    style={styles.image}
                    source={source}/>
                    {imageLoading && <View style={styles.loadingContainer}>
                        <LottieView
                            style={styles.imageLoading}
                            autoPlay={true}
                            loop={true}
                            source={require('../../assets/animations/image-loading')}/>
                    </View>}
            </View>
            <View style={styles.infoContainer}>
                <AppText style={{fontWeight: 'bold'}}>{libelle}</AppText>
                <View style={{flexDirection: 'row',alignItems: 'center'}}>
                <AppText style={{fontWeight: 'bold',fontSize: 15}}>{formatPrice(firstPrice)}</AppText>
                    {firstPrice !== secondPrice && <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <AppText>-</AppText>
                        <AppText style={{fontWeight: 'bold',fontSize: 15}}>{formatPrice(secondPrice)}</AppText>
                    </View>}
                </View>
                <AppText lineNumber={2}>{description}</AppText>
                <AppText>({totalProduct || 0})</AppText>
            </View>
            {userRoleAdmin() && <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                <AppIconButton
                    iconName='delete-forever'
                    onPress={deleteCategorie}
                    buttonContainer={{
                        backgroundColor: colors.rougeBordeau,
                        marginTop: 10
                    }}/>
                    <AppIconButton
                        onPress={editCategorie}
                        iconName='circle-edit-outline'
                        buttonContainer={{
                        backgroundColor: colors.bleuFbi,
                            marginLeft: 20
                    }}/>
            </View>
            }
        </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    image: {
        height: 200,
        width: 200,
        overflow: 'hidden',
        borderRadius: 10
    },
    container: {
        width: 350,
        height: 'auto',
        marginVertical: 20,
        paddingBottom: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: colors.leger
    },
    infoContainer: {
        backgroundColor: colors.blanc,
        marginHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageLoading: {
        height: 100,
        width: 150,
    },
    loadingContainer: {
        height: 200,
        width: 200,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.leger
    }
})
export default CategorieItem;