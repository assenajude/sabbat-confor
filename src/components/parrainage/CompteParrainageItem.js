import React from 'react';
import {View, StyleSheet} from "react-native";
import AppText from "../AppText";
import colors from "../../utilities/colors";
import AppInput from "../AppInput";
import AppIconButton from "../AppIconButton";
import useAuth from "../../hooks/useAuth";

function CompteParrainageItem({fonds, fondsLabel,fondContainerStyle,
                                  editFundValue=false, annuleEdit,
                                   editValue, onEditValueChange,
                                  children, labelStyle}) {
    const {formatPrice} = useAuth()

    return (
        <View style={[styles.fondsStyle, fondContainerStyle]}>
            <View>
            <View style={{flexDirection: 'row'}}>
                {children}
                <AppText style={[{fontWeight: 'bold'}, labelStyle]}>{fondsLabel}</AppText>
            </View>
            <AppText style={{fontWeight: 'bold'}}>{formatPrice(fonds)}</AppText>
            </View>
            {editFundValue && <View>
                <AppInput
                    placeholder='montant'
                    inputMainContainer={{backgroundColor: colors.blanc}}
                    value={editValue}
                    onChangeText={onEditValueChange}
                    keyboardType='numeric'/>
                <AppIconButton
                    onPress={annuleEdit}
                    iconName='chevron-up'
                    iconColor={colors.dark}/>
            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    fondsStyle: {
        backgroundColor: colors.blanc,
        margin: 10,
        borderRadius: 10,
        borderColor: colors.dark,
        padding: 10
    }
})

export default CompteParrainageItem;