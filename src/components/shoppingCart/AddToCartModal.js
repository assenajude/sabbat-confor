import React from 'react';

import {Modal, View, Image, StyleSheet} from 'react-native'
import AppButton from "../AppButton";
import AppText from "../AppText";
import Color from '../../utilities/colors'

function AddToCartModal({source, designation, itemModalVisible,goToHomeScreen,goToShoppingCart, cartHeight='75%', cartTop=50}) {
    return (

        <Modal transparent animationType='slide' visible={itemModalVisible}>
            <View style={[styles.mainContainer, {height: cartHeight, top:cartTop}]}>
            </View>
            <View style={styles.modalContainer}>
                <View style={styles.headerStyle}>
                <AppText style={{color: 'green', fontSize: 20, fontWeight: 'bold'}}>Felicitaion!</AppText>
                </View>
                    <View style={styles.contentStyle}>
                      <View>
                        <Image resizeMode='contain' style={styles.imageStyle} source={source}/>
                        <View>
                        <AppText lineNumber={1} style={{fontSize: 15}}>{designation}</AppText>
                        </View>
                       </View>
                        <View style={styles.textStyle}>
                            <AppText style={{color: Color.bleuFbi, fontWeight: 'bold'}}>a été ajouté au panier avec succès</AppText>
                        </View>
                </View>
                <View style={styles.buttonContainer}>
                    <AppButton
                        title="Continuer"
                        onPress={goToHomeScreen}/>
                    <AppButton
                        title='Commander'
                        onPress={goToShoppingCart}/>
                </View>
            </View>
        </Modal>

    );
}

const styles  = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        top: 200,
        padding: 10,
        paddingRight: 10,
        height: 'auto',
        width: '100%',
        borderWidth: 2,
        borderColor: Color.leger,
        borderRadius: 20,
        backgroundColor: Color.blanc
    },
    headerStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 30
    },
    contentStyle: {
        flexDirection: 'row',
        marginBottom: 20
    },
    imageStyle: {
        width: 60,
        height: 60
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    textStyle : {
        position: 'absolute',
        left:60,
        bottom: 50
    },
    mainContainer:{
        backgroundColor: Color.dark,
        opacity:0.5,
        width: '100%',
    }
})

export default AddToCartModal;