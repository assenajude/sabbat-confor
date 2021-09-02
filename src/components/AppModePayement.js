import React from 'react';
import colors from "../utilities/colors";
import {View} from "react-native";
import AppText from "./AppText";

function AppModePayement({modePayement}) {
    return (
        <View style={{
            alignSelf: 'flex-start',
            borderWidth: 1,
            margin: 5,
            marginTop: 10,
            backgroundColor: colors.rougeBordeau,
            borderColor: colors.leger
        }}>
            <View style={{
                padding: 5,
                borderRadius: 20,
                backgroundColor: colors.blanc,
            }}>
                <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>{modePayement}</AppText>
            </View>
        </View>
    );
}

export default AppModePayement;