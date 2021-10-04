import React from 'react';
import {TouchableOpacity, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import colors from "../../utilities/colors";



function ListFooter({otherStyle, onPress}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, otherStyle]}>
            <MaterialCommunityIcons name='plus' size={24} color={colors.blanc}/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: colors.bleuFbi,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default ListFooter;