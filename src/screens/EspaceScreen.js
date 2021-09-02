import React, {useState} from 'react';
import {FlatList, View, StyleSheet, ScrollView, Alert} from 'react-native'
import {useSelector, useDispatch, useStore} from "react-redux";
import * as Yup from 'yup'
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {addNewEspace, deleteOneEspace} from "../store/slices/espaceSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppText from "../components/AppText";
import ListFooter from "../components/list/ListFooter";
import AppButton from "../components/AppButton";
import AppIconButton from "../components/AppIconButton";
import colors from "../utilities/colors";

const validEspace = Yup.object().shape({
    nom: Yup.string(),
    decsription: Yup.string()
})

function EspaceScreen(props) {
    const store = useStore()
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.entities.espace.loading)
    const espaces = useSelector(state => state.entities.espace.list)
    const [addMode, setAddMode] = useState(false)
    const [editEspace, setEspace] = useState()

    const handleAddEspace = async (data) => {
        const espaceData = {
            espaceId: editEspace?editEspace.id : null,
            nom: data.nom,
            description: data.description
        }
        await dispatch(addNewEspace(espaceData))
        const error = store.getState().entities.espace.error
        if(error !==null) return alert("Error adding espace")
        alert("espace added successfully.")
    }

    const handleDeleteEspace = (espace) => {
        Alert.alert("Attention", "Voulez-vous supprimer cet espace?", [{
            text: 'oui',onPress: async () => {
                await dispatch(deleteOneEspace({espaceId: espace.id}))
                const error = store.getState().entities.espace.error
                if(error !==null) return alert("Error deleting espace")
                alert("espace deleted successfully.")
            }
        }, {
            text: 'non', onPress: () => {return;}
        }])
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            {espaces.length>0 &&
            <FlatList
                data={espaces} keyExtractor={item => item.id.toString()}
                renderItem={({item}) => <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    marginVertical: 20
                }}>
                    <AppText>{item.nom}</AppText>
                    <View style={{
                        flexDirection: 'row',
                        alignItems:'center'
                    }}>
                    <AppIconButton
                        onPress={() => {
                            setAddMode(true)
                            setEspace(item)
                        }}
                        iconName='circle-edit-outline'
                        buttonContainer={{
                            backgroundColor: colors.bleuFbi
                        }}
                    />
                    <AppIconButton
                        onPress={() => handleDeleteEspace(item)}
                        iconName='delete-forever'
                        buttonContainer={{
                            backgroundColor: colors.rougeBordeau,
                            marginLeft: 30
                        }}
                    />
                    </View>
                    </View>
                   }/>}
            {espaces.length === 0 && <View style={{
                flex:1,
                justifyContent: 'center',
                alignItems: "center"
            }}>
                <AppText>Aucun espace disponible</AppText>
            </View>}
       { addMode && <ScrollView>
           <AppForm initialValues={{
               nom: editEspace?editEspace.nom : '',
               description:editEspace?editEspace.description :  '',
           }} validationSchema={validEspace} onSubmit={handleAddEspace}>
               <AppFormField title='Nom:' name='nom'/>
               <AppFormField title='Description:' name='description'/>
               <AppSubmitButton title='Ajouter' showLoading={isLoading}/>
               <AppButton
                   iconName='keyboard-backspace'
                   title='retour'
                   onPress={() => setAddMode(false)}
                   style={{alignSelf:'flex-start'}}/>
           </AppForm>
       </ScrollView>  }
       {!addMode && <View style={styles.addNewButton}>
       <ListFooter onPress={() => setAddMode(true)}/>
       </View>}
            </>
    );
}

const styles = StyleSheet.create({
    emptyStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addNewButton: {
        position: 'absolute',
        right: 50,
        bottom: 50,
    }
})

export default EspaceScreen;