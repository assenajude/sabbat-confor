import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {AntDesign} from '@expo/vector-icons'

function AppText({children,iconName,iconColor='black',iconSize=25, style, lineNumber,...props}) {
    return (
        <View style={styles.container}>
            {iconName && <AntDesign name={iconName} color={iconColor} size={iconSize}/>}
            <Text {...props} style={[styles.contentStyle, style]} numberOfLines={lineNumber}>{children}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
    },
    contentStyle: {
        padding: 5,
        fontSize: 18
    }
})
export default AppText;