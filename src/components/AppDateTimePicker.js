import React from 'react';
import {View} from "react-native";
import DateTimePicker  from '@react-native-community/datetimepicker'
import AppButton from "./AppButton";
import colors from "../utilities/colors";

function AppDateTimePicker({getDate, getTime,changeDate,dateValue,dateMode, showPicker, dateTimeId}) {
    return (
        <View>
            <View style={{margin: 10}}>
                <AppButton
                    style={{backgroundColor: colors.bleuFbi}}
                    iconSize={20}
                    iconName='calendar'
                    title='Date'
                    onPress={getDate}/>
            </View>
            <View style={{margin: 10}}>
                <AppButton
                    style={{backgroundColor: colors.bleuFbi}}
                    iconSize={20}
                    iconName='hours-24'
                    title="Heure"
                    onPress={getTime} />
            </View>
            {showPicker && <DateTimePicker
                              testID={dateTimeId}
                              value={dateValue}
                              mode={dateMode}
                             is24Hour={true}
                             display='default'
                             onChange={changeDate}/>}
        </View>
    );
}

export default AppDateTimePicker;