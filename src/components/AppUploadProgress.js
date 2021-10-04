import React from 'react';
import {Modal, View, StyleSheet} from 'react-native'
import colors from "../utilities/colors";
import LottieView from "lottie-react-native";
import AppIconButton from "./AppIconButton";
import {ProgressBar} from "react-native-paper";

function AppUploadProgress({startProgress, progress=0, dismissUploadModal}) {
    if(!startProgress)return null;
    return (
        <>
            <View style={styles.modalContainer}>
            </View>
            <View  style={styles.content}>
                <LottieView
                    style={{ width: 100}}
                    autoPlay={true}
                    loop={true}
                    source={require('../assets/animations/loading')}/>
                <ProgressBar
                    style={{
                    width: 200
                }} progress={progress} color={colors.bleuFbi}/>
                <AppIconButton
                    onPress={dismissUploadModal}
                    buttonContainer={styles.closeIcon}
                    iconName='close'
                    iconColor={colors.rougeBordeau}
                    iconSize={25}/>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.dark,
        opacity: 0.3,
        position: 'absolute',
        zIndex: 5
    },
    content: {
        position: 'absolute',
        backgroundColor: colors.blanc,
        width: '90%',
        height: 120,
        alignItems: 'center',
        alignSelf: 'center',
        top:'50%',
        zIndex: 10,
        paddingBottom: 20
    },
    closeIcon: {
        position :'absolute',
        top: 10,
        right: 10
    }
})
export default AppUploadProgress;