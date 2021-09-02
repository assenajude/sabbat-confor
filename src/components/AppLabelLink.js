import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from "react-native";
import colors from "../utilities/colors";

function AppLabelLink({handleLink, content, otherTextStyle, containerStyle}) {
    return (
        <View style={styles.container}>
        <TouchableOpacity onPress={handleLink}>
            <View style={containerStyle}>
            <Text style={[styles.textStyle, otherTextStyle]}> {content}</Text>
            </View>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    textStyle: {
        color: colors.bleuFbi,
        fontSize: 15
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        minWidth:40,
        width: 'auto',
        marginVertical: 10
    }
})
export default AppLabelLink;