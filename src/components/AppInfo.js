import React from 'react';
import {View,StyleSheet} from "react-native";

function AppInfo({children}) {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 15
    }
})

export default AppInfo;