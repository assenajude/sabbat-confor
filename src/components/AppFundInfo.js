import React from 'react';
import {View, StyleSheet} from "react-native";
import AppText from "./AppText";
import colors from "../utilities/colors";
import useAuth from "../hooks/useAuth";

function AppFundInfo({label, value}) {
    const {formatPrice} = useAuth()
    return (
        <View style={styles.container}>
            <AppText style={{fontSize: 15}}>{label}</AppText>
            <View style={styles.value}>
                <AppText style={{color: value>0?colors.vert : colors.dark, fontWeight: 'bold'}}>{formatPrice(value)}</AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.leger,
        maxWidth: 150,
        minWidth: 120,
        padding: 10,
        borderRadius: 10,
        marginVertical: 10
    },
    value: {
        backgroundColor: colors.blanc,
        height: 60,
        justifyContent: 'center'
    }
})

export default AppFundInfo;