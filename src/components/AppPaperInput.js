import React from 'react';
import {View, StyleSheet} from 'react-native'
import {TextInput} from "react-native-paper";
import AppIconButton from "./AppIconButton";
import colors from "../utilities/colors";


function AppPaperInput({label, value, onChangeValue, icon, deleteInput}) {
    return (
        <View>
        <TextInput
            onChangeText={onChangeValue}
            value={value}
            label={label}
            left={<TextInput.Icon name={icon} />}
        />
        <AppIconButton
            iconColor={colors.rougeBordeau}
            buttonContainer={styles.deleteButton}
            onPress={deleteInput}
            iconName='delete-forever'/>
        </View>
    );
}

const styles = StyleSheet.create({
    deleteButton: {
        position:'absolute',
        top:-40,
        right: 5
    }
})

export default AppPaperInput;