import React, {useState} from 'react';
import {StyleSheet, View, Platform} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker'
import {useFormikContext} from "formik";

import AppText from "../AppText";
import dayjs from "dayjs";
import AppErrorMessage from "./AppErrorMessage";
import colors from "../../utilities/colors";

function AppFormTimePicker({name, label}) {

    const {errors, touched, setFieldValue, values} = useFormikContext()

    const [show, setShow] = useState(false)
    const [mode, setMode] = useState('date')


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || values[name]
        setShow(Platform.OS === 'ios');
        setFieldValue(name, currentDate)

    }

    const showMode = (currentMode) => {
        setShow(true)
        setMode(currentMode)
    }
    const showDatePicker = () => {
        showMode('date')
    }

    const showTimePicker = () => {
        showMode('time')
    }

    return (
        <View>
            {show && (
                <DateTimePicker
                    testID='dateTimePicker'
                    value={values[name]}
                    mode={mode}
                    is24Hour={true}
                    display='default'
                    onChange={onChange}
                />
            )}
            <View>
                <View style={styles.dateStyle}>
                    <AppText>{label}: </AppText>
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <AppText style={{fontSize: 15}}>{dayjs(values[name]).format('DD/MM/YYYY')}</AppText>
                        <AppText style={{color: colors.bleuFbi, marginTop:5}} onPress={showDatePicker}>Changer</AppText>
                    </View>
                    <AppText>à</AppText>
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <AppText style={{fontSize: 15}}>{dayjs(values[name]).format('HH:mm:ss')}</AppText>
                        <AppText style={{color: colors.bleuFbi, marginTop: 5}} onPress={showTimePicker}>Changer</AppText>
                    </View>
                </View>
            </View>
            <AppErrorMessage error={errors[name]} visible={touched[name]}/>
        </View>
    );
}

const styles = StyleSheet.create({
    dateStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginHorizontal: 10

    }
})
export default AppFormTimePicker;