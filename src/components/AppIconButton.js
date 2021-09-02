import React from 'react';
import {TouchableOpacity, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import colors from "../utilities/colors";


function AppIconButton({onPress, iconName, iconSize=24, iconColor=colors.dark, buttonContainer}) {
    return (
        <TouchableOpacity style={[styles.container,buttonContainer]} onPress={onPress}>
            <MaterialCommunityIcons name={iconName} color={iconColor} size={iconSize}/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blanc
    }
})
export default AppIconButton;