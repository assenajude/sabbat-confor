import React from 'react';
import {View, StyleSheet} from "react-native";
import {Picker} from '@react-native-picker/picker'
import AppText from "./AppText";
import colors from "../utilities/colors";

function AppItemPicker({items,label, style, selectedValue, onValueChange, otherProps}) {
    return (
        <View style={styles.container}>
            <AppText style={{fontWeight: 'bold', fontSize:15}}>{label}</AppText>
            <Picker
                style={[styles.picker, style]}
                mode='dropdown'
                selectedValue={selectedValue}
                onValueChange={onValueChange} {...otherProps}>
                {items.map((item,index) =>
                    <Picker.Item
                        key={index.toString()}
                        label={item}
                        value={item}/>)}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
        backgroundColor: colors.leger,
        justifyContent: 'space-around',
        width: '80%',
        alignSelf: 'center'
    },
    picker:{width:120, maxWidth:200, height: 50}
})
export default AppItemPicker;