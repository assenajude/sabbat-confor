import React from 'react';
import {View, StyleSheet} from 'react-native'
import {TextInput} from "react-native-paper";
import AppIconButton from "./AppIconButton";
import colors from "../utilities/colors";


function AppInput({title,textInputRef, value, onChangeText, iconName, deleteFormInput,deleteInputIcon, ...otherProps}) {
    return (
        <View style={styles.container}>
            <TextInput
                ref={textInputRef}
                onChangeText={onChangeText}
                value={value}
                label={title}
                left={<TextInput.Icon name={iconName}/>}
                {...otherProps}
            />
            {deleteInputIcon && <AppIconButton
                iconColor={colors.rougeBordeau}
                buttonContainer={styles.deleteButton}
                onPress={deleteFormInput}
                iconName={deleteInputIcon}/>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      marginVertical: 20,
        marginHorizontal: 20
    },
    deleteButton: {
        position:'absolute',
        top:-40,
        right: 5
    }
})

export default AppInput;