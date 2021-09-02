import React from 'react';
import {View, StyleSheet} from "react-native";
import AppText from "./AppText";
import colors from "../utilities/colors";

function DelaiPlanShower({delai, otherContainerStyle}) {
    return (
        <View style={[styles.container, otherContainerStyle]}>
            <View style={styles.delaiStyle}>
                <AppText style={{color: colors.or, fontWeight: 'bold', fontSize: 15}}>{delai}</AppText>
            </View>
            <View style={styles.delaiBrancheStyle} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
      alignItems: 'center'
    },
    delaiStyle: {
        borderWidth: 1,
        borderRadius: 50,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.blanc
    },
    delaiBrancheStyle: {
        height: 15,
        borderWidth: 1,
        width: 1
    }
})
export default DelaiPlanShower;