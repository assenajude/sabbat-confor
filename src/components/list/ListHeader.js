import React from 'react';
import {View, StyleSheet} from 'react-native'

import AppText from "../AppText";



function ListHeader(props) {
    return (
        <View elevation={1} style={styles.container}>
            <AppText style={{fontWeight: 'bold'}}>Id</AppText>
            <AppText style={{fontWeight: 'bold', marginLeft: 20}}>Plus d'infos</AppText>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
    }
})
export default ListHeader;