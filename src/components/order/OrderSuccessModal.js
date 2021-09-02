import React from 'react';
import {Modal, StyleSheet, View} from "react-native";
import colors from "../../utilities/colors";
import LottieView from "lottie-react-native";
import AppText from "../AppText";
import AppButton from "../AppButton";

function OrderSuccessModal({newOrder, goHome, goToOrder, orderSuccessVisible}) {

    return (
        <Modal visible={orderSuccessVisible} transparent>
            <View style={styles.container}>
            </View>
            <View style={styles.content}>
                <LottieView
                    style={{
                        height: 100,
                        width: 200,
                        alignSelf: 'center'
                    }}
                    loop={false}
                    autoPlay={true}
                    source={require('../../assets/animations/order_success')}/>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 40
                }}>
                    <AppText style={{fontWeight: 'bold', fontSize: 25}}>N°: </AppText>
                    <AppText style={{fontWeight: 'bold', fontSize: 25, color: colors.or}}>{newOrder.numero}</AppText>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around'
                }}>
                    <AppButton
                        iconName='home'
                        onPress={goHome}
                        title='Accueil'/>
                    <AppButton
                        onPress={goToOrder}
                        title='Commande'
                    />
                </View>
            </View>

        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: colors.dark,
        opacity: 0.3
    },
    content: {
        position :'absolute',
        top: 100,
        height: 'auto',
        width: '100%',
        backgroundColor: colors.blanc,
        paddingBottom: 10
    }
})

export default OrderSuccessModal;