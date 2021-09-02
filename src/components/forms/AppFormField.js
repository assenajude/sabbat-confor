import React from 'react';
import {useFormikContext} from 'formik'
import {TextInput} from "react-native-paper";
import {StyleSheet, View} from 'react-native'

import AppErrorMessage from "./AppErrorMessage";

function AppFormField({name,formfieldRef, title,iconName, ...otherProps}) {

    const {handleChange,errors, touched, setFieldTouched, values} = useFormikContext()

    return (
        <View  style={styles.container}>
            <TextInput
                style={styles.input}
                left={iconName?<TextInput.Icon name={iconName}/>:null}
                ref={formfieldRef}
                label={title}
                value={values[name]}
                onBlur={() => setFieldTouched(name) }
                onChangeText={handleChange(name)}
                {...otherProps}
            />
            <AppErrorMessage error={errors[name]} visible={touched[name]}/>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        marginHorizontal: 20
    }
})
export default AppFormField;