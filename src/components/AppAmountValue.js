import React from 'react';
import {View, StyleSheet} from "react-native";
import AppText from "./AppText";
import useAuth from "../hooks/useAuth";
import colors from "../utilities/colors";

function AppAmountValue({label, value}) {
    const {formatPrice} = useAuth()
    return (
        <View style={styles.container}>
            <AppText style={{fontWeight: 'bold', fontSize: 15}}>{label}</AppText>
            <AppText style={{fontSize: 15, color: colors.rougeBordeau}}>{formatPrice(value)}</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between'
    }
})

export default AppAmountValue;