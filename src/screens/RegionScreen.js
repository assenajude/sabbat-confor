import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ScrollView, View, StyleSheet, FlatList} from 'react-native'
import * as Yup from 'yup'

import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {addRegion} from '../store/slices/regionSlice'
import ListItem from "../components/list/ListItem";
import ListFooter from "../components/list/ListFooter";
import AppButton from "../components/AppButton";

const valideRegionSchema = Yup.object().shape({
    nom: Yup.string(),
    localisation: Yup.string()
})

function RegionScreen(props) {
    const dispatch = useDispatch()
    const regions = useSelector(state => state.entities.region.list);

    const [addNew, setAddNew] = useState(false)
    const [listMode, setListMode] = useState(true)

   const handleAddRegion = async (region) => {
        await dispatch(addRegion(region))
       setAddNew(false);
        setListMode(true)

    }

    return (
        <View style={styles.container}>
            <FlatList data={regions} keyExtractor={item => item.id.toString()}
            renderItem={({item}) =><ListItem propriety1={item.id} propriety2={item.nom} propriety3={item.localisation}/>}/>
           {addNew && <ScrollView>

                <AppForm initialValues={{
                    nom: '',
                    localisation: ''
                }} validationSchema={valideRegionSchema} onSubmit={handleAddRegion}>
                    <AppFormField title='Nom' name='nom'/>
                    <AppFormField title='Localisation' name='localisation'/>
                    <AppSubmitButton title='Ajouter'/>
                </AppForm>
               <AppButton title='retour' style={{width: 80, backgroundColor: 'green'}}
                          onPress={() => {
                              setAddNew(false);
                              setListMode(true)
                          }} />
            </ScrollView>}
      {listMode &&   <ListFooter otherStyle={styles.buttonStyle} onPress={() => {
                setAddNew(true)
                setListMode(false)
      }}/>}
        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    buttonStyle: {
        alignSelf: 'flex-end',
        margin: 60
    }
})
export default RegionScreen;