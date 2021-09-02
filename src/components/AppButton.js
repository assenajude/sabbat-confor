import React from 'react';
import {StyleSheet} from "react-native";
import {Button} from "react-native-paper";

import colors from '../utilities/colors'

function AppButton({iconName,onPress,title,style,labelStyle, ...props }) {
    return (
        <Button
            icon={iconName}
            mode='contained'
            onPress={onPress}
            style={[style]}
            labelStyle={labelStyle}
            {...props}
        >{title}</Button>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderRadius: 10,
        marginHorizontal: 10
    },
    contentStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        color: colors.blanc,
        fontSize: 18
    }
})

export default AppButton;
/*
import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons"
import colors from "../utilities/colors";


function AppButton({title,color1='#4c669f',color2='#3b5998',color3='#192f6a', otherButtonStyle, textStyle,iconName,iconSize=30,iconColor='white', onPress}) {
    return (

        <LinearGradient
            colors={[`${color1}`,`${color2}`,`${color3}`]}
            style={[styles.buttonStyle, otherButtonStyle]}>
            <TouchableOpacity style={[styles.buttonStyle, otherButtonStyle]} onPress={onPress}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    {iconName && <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor}/>}
                    <Text style={[styles.textStyle, textStyle]}>{title}</Text>
                </View>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginVertical: 10,
        width: '100%',
        borderRadius: 40
    },
    textStyle: {
        color: colors.white,
        fontSize: 20,
        marginLeft: 5
    }
})
export default AppButton;*/
