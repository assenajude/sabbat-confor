import React from 'react';
import {View, Switch, StyleSheet, Text} from 'react-native'
import colors from '../utilities/colors'

function AppSwitch({title,switchValue, switchValueChange, ...props}) {
    return (
        <View style={styles.container}>
            <Text style={{marginRight: 20}}>{title}</Text>
            <Switch trackColor={{false: "#767577", true: colors.bleuFbi}}  value={switchValue} onValueChange={switchValueChange} {...props}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    }
})

export default AppSwitch;