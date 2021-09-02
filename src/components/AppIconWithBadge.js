import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons'

import Color from '../utilities/colors'

function AppIconWithBadge({name, size=24, color=Color.dark, badgeCount, style, notifStyle}) {
    return (
        <View style={[styles.mainView, style]}>
            {name && <MaterialCommunityIcons
                name={name}
                size={size} color={color}/>}
            {badgeCount > 0 &&
            <View style={[styles.notifContainer, notifStyle]}>
                <Text numberOfLines={1} style={styles.notifContent}>{badgeCount}</Text>
            </View> }
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        width: 24,
        height: 24,
        margin: 5
    },
    notifContainer: {
        position: 'absolute',
        right: -6,
        top: -3,
        borderRadius: 10,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.rougeBordeau

    },
    notifContent: {
        color: Color.blanc,
        fontSize: 10,
        padding: 3,
        fontWeight: 'bold'

    }

})
export default AppIconWithBadge;