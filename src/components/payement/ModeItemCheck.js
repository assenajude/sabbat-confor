import React from 'react';
import {View, StyleSheet, TouchableOpacity} from "react-native";
import {Octicons} from '@expo/vector-icons';
import AppText from "../AppText";
import colors from "../../utilities/colors";

function ModeItemCheck({modeTitle,isActive, getModeActive, isPayementDisabled}) {
    return (
        <>
        <TouchableOpacity onPress={getModeActive}>
        <View style={styles.mainStyle}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                <View style={{
                    height: 25,
                    width: 25,
                    borderWidth: 1,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View>
                    {isActive && <Octicons name="primitive-dot" size={24} color={colors.or} />}
                    </View>
                </View>
                <AppText>{modeTitle}</AppText>
                </View>
        </View>
    {isPayementDisabled && <View style={styles.disableStyle}>
    </View>}
      </TouchableOpacity>
    </>
    );
}

const styles = StyleSheet.create({
    mainStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 30,
        alignItems: 'center'
    },
    disableStyle: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
         opacity: 0.8,
        height: 80,
        width: 80,
        zIndex: 1,
        backgroundColor: colors.blanc,
    }
})

export default ModeItemCheck;