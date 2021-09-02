import React, {useState} from 'react';
import {View} from "react-native";
import {useFormikContext} from "formik";
import * as Yup from 'yup'
import AppText from "../AppText";
import AppInput from "../AppInput";
import AppForm from "./AppForm";
import AppFormField from "./AppFormField";
import AppSubmitButton from "./AppSubmitButton";
import colors from "../../utilities/colors";
import AppButton from "../AppButton";

const optionValideSchema = Yup.object().shape({
    libelle: Yup.string(),
    value: Yup.string()
})

function AppFormOption({name}) {

    const {setFieldValue, values} = useFormikContext();
    const optionsTab = values[name]
    const [newMode, setNewMode] = useState(false)

    const handleSaveOption = optionData => {
        setFieldValue(name,[...optionsTab, {label: optionData.libelle, value: optionData.value}])
        setNewMode(!newMode)
    }



    return (
        <View style={{
            marginVertical: 20
        }}>
            {optionsTab.map((item, index) =>
                <AppInput
                    deleteInputIcon='delete-forever'
                    key={index.toString()}
                    title={item.label}
                    value={optionsTab[index].value}
                    onChangeText={(val) => {
                    let selectedItem = values[name][index];
                    selectedItem.value = val
                    setFieldValue(name[index],selectedItem)
                }}
                    deleteFormInput={() => {
                    const allInputs = values[name]
                    const newInputs = allInputs.filter((item,itemIndex) => itemIndex !== index)
                    setFieldValue(name, newInputs)
                }}/>
                )}
            {newMode && <View style={{borderWidth: 1, padding: 10}}>
                <View style={{backgroundColor: colors.rougeBordeau}}>
                    <AppText style={{color: colors.blanc}}>new option</AppText>
                </View>

                <AppForm initialValues={{
                    libelle: '',
                    value: ''
                }} validationSchema={optionValideSchema} onSubmit={handleSaveOption}>
                    <AppFormField title='Libellé' name='libelle'/>
                    <AppFormField title='Valeur' name='value'/>
                    <AppSubmitButton title="Ajouter l'option"/>
                </AppForm>
                <AppButton
                    style={{alignSelf: 'flex-start'}}
                    onPress={() => setNewMode(!newMode)}
                    title='Annuler'
                />
            </View>}
            {!newMode && optionsTab.length < 5 &&
                <AppButton
                    onPress={() => setNewMode(!newMode)}
                    title='option'
                    iconName='plus'
                />
            }
        </View>
    );
}

export default AppFormOption;