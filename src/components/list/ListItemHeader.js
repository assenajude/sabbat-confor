import React from 'react';
import {View, StyleSheet} from "react-native";
import AppText from "../AppText";
import colors from "../../utilities/colors";

function ListItemHeader({headerTitle}) {
    return (
        <View style={styles.headerStyle}>
            <AppText style={{color: colors.blanc, fontSize: 30, fontWeight: 'bold'}}>{headerTitle}</AppText>
        </View>
    );
}


const styles = StyleSheet.create({
    headerStyle: {
        height: 50,
        width: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.rougeBordeau
    }
})

export default ListItemHeader;