import React from 'react';
import {StyleSheet} from 'react-native'

import AppText from "../AppText";
import Color from '../../utilities/colors'

function AppErrorMessage({error, visible}) {
    if (!error || !visible) return null;
    return (
        <AppText style={styles.textStyle}>{error}</AppText>
    );
}

const styles = StyleSheet.create({
    textStyle: {
        color:Color.rouge,
        backgroundColor: Color.blanc
    }
})

export default AppErrorMessage;