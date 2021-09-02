import React from 'react';
import {TouchableWithoutFeedback, View, StyleSheet} from "react-native";
import AppText from "./AppText";
import AppIconButton from "./AppIconButton";
import colors from "../utilities/colors";

function AppLinkIcon({onPress, title, details, containerStyle}) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={[styles.params,containerStyle]}>
                <AppText>{title}</AppText>
                <AppIconButton
                    iconColor={colors.dark}
                    iconName={details?'chevron-down' : 'chevron-right'} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    params: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10
    }
})

export default AppLinkIcon;