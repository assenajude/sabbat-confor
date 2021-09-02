import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch, useStore} from 'react-redux'
import {View, StyleSheet, ScrollView, FlatList, Alert} from 'react-native'
import * as Yup from 'yup';


import ListFooter from "../components/list/ListFooter";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import {loadPayements, createPayement, deleteOnePayement} from '../store/slices/payementSlice'
import AppIconButton from "../components/AppIconButton";
import colors from "../utilities/colors";
import AppActivityIndicator from "../components/AppActivityIndicator";

const validePayementSchema = Yup.object().shape({
    mode: Yup.string()
})

function PayementScreen() {
    const store = useStore()
    const dispatch = useDispatch();
    const payements = useSelector(state => state.entities.payement.list);
    const loading = useSelector(state => state.entities.payement.loading);
    const [mode, setMode] = useState(0);
    const [editPayement, setEditPayement] = useState()


   const getAllPayements = useCallback(async () => {
        await dispatch(loadPayements())
   }, [])

    const addNewPayement = async (payement) => {
        const data = {
            payementId: editPayement?editPayement.id: null,
            mode: payement.mode
        }
        await dispatch(createPayement(data));
        const error = store.getState().entities.payement.error
        if(error !== null) {
            return alert('Error adding payement')
        }
        alert("Payement added successfully.")
        setMode(0)
    }

    const handleDeletePayement = (payement) => {
        Alert.alert("Attention", "Voulez-vous supprimer definitivement ce payement.", [{
            text: 'oui', onPress: async () => {
                await dispatch(deleteOnePayement({payementId: payement.id}))
                const error = store.getState().entities.payement.error
                if(error !== null) {
                    return alert('Error deleting payement')
                }
                alert("Payement deleted successfully.")
            }
        }, {text: 'non', onPress: () => {return;}}])
    }

    useEffect(() => {
        getAllPayements();
    }, [])

    return (
        <>
            <AppActivityIndicator visible={loading}/>
        <View>
           <View>
               { payements.length === 0 &&
                   <View style={styles.vide}>
                       <AppText>Aucun payement trouvé</AppText>
                   </View>
               }

               <FlatList data={payements}
                         keyExtractor={item => item.id.toString()}
               renderItem={({item}) => <View style={{
                   flexDirection: 'row',
                   alignItems: 'center',
                   justifyContent: 'space-around',
                   marginVertical: 20
               }}>
                   <AppText>{item.mode}</AppText>
                   <View style={{
                       flexDirection: 'row',
                       alignItems: 'center'
                   }}>
                       <AppIconButton
                           onPress={() => {
                               setMode(1)
                               setEditPayement(item)
                           }}
                           iconName='circle-edit-outline'
                           buttonContainer={{
                               backgroundColor: colors.bleuFbi
                           }}
                       />
                       <AppIconButton
                           onPress={() => handleDeletePayement(item)}
                           buttonContainer={{
                               marginLeft: 30,
                               backgroundColor: colors.rougeBordeau
                           }}
                           iconName='delete-forever'
                       />
                   </View>
               </View>}/>
           </View>
            {mode === 1 && <ScrollView>
                <AppForm initialValues={{
                    mode: editPayement?editPayement.mode : ''
                }} validationSchema={validePayementSchema} onSubmit={addNewPayement}>
                    <AppFormField name='mode' title='Mode'/>
                    <AppSubmitButton title='Ajouter'/>
                    <AppButton style={styles.retour}  onPress={() => setMode(0)} title='retour'/>
                </AppForm>
            </ScrollView>}
        </View>
          {mode ===0 &&  <View style={styles.addButton}>
                <ListFooter onPress={() => setMode(1)} />
            </View>}
        </>

    );
}

const styles = StyleSheet.create({
    addButton: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    retour: {
        padding: 2,
        width: 60,
        margin: 10
    },
    vide: {
      flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: 50
    }
})
export default PayementScreen;