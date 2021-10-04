import React from 'react';
import {Modal, View, StyleSheet, Image} from "react-native";
import colors from "../utilities/colors";
import AppLottieViewAnim from "./AppLottieViewAnim";
import AppIconButton from "./AppIconButton";
import AppText from "./AppText";

function OrderHelpModal({visible, closeModal, selectedSource}) {
    return (
        <Modal transparent visible={visible}>
            <View style={styles.container}>
            </View>
            <View style={styles.content}>
                <AppLottieViewAnim
                    lottieStyle={{
                    height: 250,
                    width: 250,
                        alignItems: 'flex-start'
                }}
                    lottieLoop={true} lottieAutoPlay={true}
                    lottieSource={require('../assets/animations/hello')}/>
                    <View style={styles.info}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <AppText>cet article</AppText>
                            <Image resizeMode='contain'
                                   source={selectedSource} style={{height: 100, width: 100}}/>
                        </View>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <AppText>peut être commandé à</AppText>
                            <AppText style={{fontWeight: 'bold'}}>crédit</AppText>

                        </View>
                    </View>
                    <AppIconButton
                        buttonContainer={styles.eye}
                        iconColor={colors.bleuFbi}
                        iconName='eye-outline'
                        onPress={closeModal}/>
                <AppIconButton
                    onPress={closeModal}
                    buttonContainer={styles.close}
                    iconColor={colors.rougeBordeau}
                    iconName='close'
                />
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    container: {
        top: 50,
        height: '88%',
        width: '100%',
        backgroundColor: colors.dark,
        opacity: 0.4
    },
    content: {
        position:'absolute',
        top: 200,
        height: 350,
        width: "100%",
        backgroundColor: colors.blanc,
    },
    info: {
        position: 'absolute',
        left: 10,
        bottom: 50
    },
    eye: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        marginHorizontal: 10,
        marginVertical: 10
    },
    close: {
        position: 'absolute',
        right: 10,
        top: 10,
        marginRight: 15,
        marginTop: 10
    }
})
export default OrderHelpModal;