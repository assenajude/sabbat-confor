import React from 'react';
import {StyleSheet} from "react-native";
import colors from "../utilities/colors";
import {IconButton} from "react-native-paper";


function AppIconButton({onPress, iconName, iconSize=25, iconColor=colors.dark, buttonContainer}) {
    return (
        <IconButton
            onPress={onPress}
            size={iconSize}
            style={[styles.container, buttonContainer]}
            color={iconColor}
            icon={iconName}
        />
    );
}

const styles = StyleSheet.create({
    container: {backgroundColor: colors.blanc}
})
export default AppIconButton;