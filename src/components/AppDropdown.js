import React from 'react';
import {View, StyleSheet} from 'react-native'
import {Picker} from '@react-native-community/picker'
import AppText from "./AppText";

function AppDropdown({title,checkedValue, changeValue, listTab}) {

    const getList = () => {
        return (
            listTab.map((item, index) => <Picker.Item label={item.modePayement} value={item.id} key={index}/>)
        )
    }

    return (
        <View style={styles.listContainer} >
            <AppText>{title}: </AppText>
            <Picker style={styles.pickerList} selectedValue={checkedValue} onValueChange={changeValue}>
                {getList()}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        flexDirection: 'row'
    },
    pickerList: {
        height: 50,
        width: 150
    }
})

export default AppDropdown;