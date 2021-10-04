import React from 'react';
import {View, StyleSheet} from "react-native";
import colors from "../utilities/colors";
import LottieView from "lottie-react-native";


function AppActivityIndicator({visible}) {
    if(!visible) return null;
    return (
        <>
            <View style={styles.mainContainer}>
            </View>
            <View style={styles.container}>
                <LottieView
                    style={{ width: 100}}
                    autoPlay={true}
                    loop={true}
                    source={require('../assets/animations/loading.json')}/>
            </View>
        </>


    )
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '90%',
        height: 100,
        backgroundColor: colors.blanc,
        top: '50%',
        zIndex: 10
    },
    mainContainer: {
        backgroundColor: colors.dark,
        opacity: 0.3,
        height: '100%',
        width: '100%',
        zIndex: 5,
        position: 'absolute'
    }
})

export default AppActivityIndicator;