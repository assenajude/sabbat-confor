import React from 'react';
import {View, StyleSheet, Modal} from "react-native";
import colors from "../utilities/colors";
import LottieView from "lottie-react-native";


function AppActivityIndicator({visible}) {
    if(!visible) return null;
    return (
        <Modal visible={visible} transparent>
            <View style={{
                backgroundColor: colors.dark,
                opacity: 0.3,
                height: '100%',
                width: '100%'
            }}>
            </View>
            <View style={styles.container}>
                <LottieView
                    style={{ width: 200, height: 100}}
                    autoPlay={true}
                    loop={true}
                    source={require('../assets/animations/loading.json')}/>
            </View>
        </Modal>


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
        top: '40%'
    }
})

export default AppActivityIndicator;