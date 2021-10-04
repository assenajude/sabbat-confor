import React from 'react';
import {ScrollView} from "react-native";
import AppText from "./AppText";
import colors from "../utilities/colors";
import dayjs from "dayjs";
import {AntDesign} from "@expo/vector-icons";
import {View, StyleSheet} from "react-native";

function TrancheItem({trancheIndex, trancheMontant, isTranchePayed, tranchePayedDate, trancheDateEcheance,
                         payedState,}) {
    return (
        <ScrollView horizontal>
        <View style={styles.container}>
            <AppText> {trancheIndex} - </AppText>
            <AppText style={{color: colors.rougeBordeau}}>{trancheMontant} fcfa</AppText>
            <AppText>{isTranchePayed?'payé le: ' + dayjs(tranchePayedDate).format('DD/MM/YYYY HH:mm:ss'):'avant le: ' + dayjs(trancheDateEcheance).format('DD/MM/YYYY HH:mm:ss')}</AppText>
            {isTranchePayed && payedState && payedState.toLowerCase() === 'confirmed' && <AntDesign name="check" size={24} color="green" />}
            {isTranchePayed && payedState && payedState.toLowerCase() === 'pending' && <AppText style={{color: colors.marronClair}}>en cours...</AppText>}
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})
export default TrancheItem;