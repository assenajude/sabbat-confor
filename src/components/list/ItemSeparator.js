import React from 'react';
import {View, StyleSheet} from 'react-native'
import color from '../../utilities/colors'

function ItemSeparator(props) {
    return (
        <View style={styles.separatorStyle}>
        </View>
    );
}

const styles = StyleSheet.create({
    separatorStyle: {
        height:1,
        width: '100%',
        backgroundColor: color.leger
    }
})

export default ItemSeparator;