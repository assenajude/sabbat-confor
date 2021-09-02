import React from 'react';
import {ScrollView} from "react-native";
import AppText from "./AppText";
import colors from "../utilities/colors";
import dayjs from "dayjs";
import {AntDesign} from "@expo/vector-icons";
import AppButton from "./AppButton";
import {View, StyleSheet} from "react-native";
import useAuth from "../hooks/useAuth";
import {useSelector} from "react-redux";

function TrancheItem({trancheIndex, trancheMontant, isTranchePayed, tranchePayedDate, trancheDateEcheance,
                         payTranche, payedState, validatePayement, ownerUserId}) {
    const connectedUser = useSelector(state => state.auth.user)
   const {userRoleAdmin} = useAuth()
    return (
        <ScrollView horizontal>
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <AppText> {trancheIndex} - </AppText>
            <AppText style={{color: colors.rougeBordeau}}>{trancheMontant} fcfa</AppText>
            <AppText>{isTranchePayed?'payé le: ' + dayjs(tranchePayedDate).format('DD/MM/YYYY HH:mm:ss'):'avant le: ' + dayjs(trancheDateEcheance).format('DD/MM/YYYY HH:mm:ss')}</AppText>
            {isTranchePayed && payedState && payedState.toLowerCase() === 'confirmed' && <AntDesign name="check" size={24} color="green" />}
            {isTranchePayed && payedState && payedState.toLowerCase() === 'pending' && <AppText style={{color: colors.marronClair}}>en cours...</AppText>}
            {!isTranchePayed && connectedUser.id === ownerUserId &&
            <AppButton
                width={100}
                height={35}
                onPress={payTranche}
                title='payer'/>}
            {userRoleAdmin() &&
            <AppButton
                width={100}
                height={35}
                title='validate'
                style={{color: colors.rougeBordeau}}
                onPress={validatePayement}/>}
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    payStyle:{
        backgroundColor: 'green',
        width: 'auto',
        height: 16,
        marginLeft: 5,
        paddingRight:5}
})
export default TrancheItem;