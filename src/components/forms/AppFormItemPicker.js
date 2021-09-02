import React from 'react';
import AppItemPicker from "../AppItemPicker";
import {useFormikContext} from "formik";

function AppFormItemPicker({items, label, name, handleSelectedValue}) {
    const {values, setFieldValue} = useFormikContext()

    const changeValue = (val) => {
        setFieldValue(name, val)
        handleSelectedValue(val)
    }
    return (
        <AppItemPicker
            label={label}
            items={items}
            selectedValue={values[name]}
            onValueChange={val => changeValue(val)} />
    );
}

export default AppFormItemPicker;