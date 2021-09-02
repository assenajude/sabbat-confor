import React from 'react';
import {Modal, View, StyleSheet} from 'react-native'
import * as Progress from 'react-native-progress'
import colors from "../utilities/colors";
import LottieView from "lottie-react-native";
import AppIconButton from "./AppIconButton";

function AppUploadProgress({startProgress, progress=0, dismissUploadModal}) {
    return (
        <Modal visible={startProgress} transparent>
            <View style={styles.modalContainer}>
            </View>
            <View  style={styles.content}>
                <LottieView style={{ width: 200}} autoPlay={true} loop={true} source={require('../assets/animations/loading')}/>
                <Progress.Bar style={{marginTop: -20}} progress={progress} color={colors.rougeBordeau}/>

                <AppIconButton
                    onPress={dismissUploadModal}
                    buttonContainer={styles.closeIcon}
                    iconName='close'
                    iconColor={colors.rougeBordeau}
                    iconSize={25}/>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.dark,
        opacity: 0.5
    },
    content: {
        position: 'absolute',
        backgroundColor: colors.blanc,
        width: '100%',
        height: '25%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        top: 250
    },
    closeIcon: {
        position :'absolute',
        top: 10,
        right: 10
    }
})
export default AppUploadProgress;