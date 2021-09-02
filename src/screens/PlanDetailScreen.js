import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Image} from "react-native";
import AppText from "../components/AppText";
import colors from "../utilities/colors";
import AppModePayement from "../components/AppModePayement";
import {useStore, useDispatch, useSelector} from "react-redux";
import AppLabelWithValue from "../components/AppLabelWithValue";
import {getSelectedPlan} from "../store/slices/payementSlice";
import usePayementPlan from "../hooks/usePayementPlan";
import AppButton from "../components/AppButton";

function PlanDetailScreen({route, navigation}) {
    const selectedPlan = route.params
    const store = useStore()
    const dispatch = useDispatch()
    const {isPlanDisabled} = usePayementPlan()

    const [modePayement, setModePayement] = useState('')
    const currentOrder = useSelector(state => state.entities.order.currentOrder)



    useEffect(() => {
        if(selectedPlan) {
            const plans = store.getState().entities.plan.list
            const newPlan = plans.find(item => item.id === selectedPlan.id)
            setModePayement(newPlan.Payement.mode)
        }
    }, [])

    return (
        <ScrollView>
            <View style={{margin: 20}}>
            <AppModePayement modePayement={modePayement}/>
            </View>
            <View style={styles.imageContainer}>
               {selectedPlan.imagesPlan.length>0 &&  <View>
                <Image source={{uri: selectedPlan.imagesPlan[0]}} style={styles.imageStyle}/>
                <AppText style={{color: colors.rougeBordeau, fontSize: 40}}>{selectedPlan.libelle}</AppText>
                </View>}
                {selectedPlan.imagesPlan.length === 0 && <AppText style={{color: colors.rougeBordeau, fontSize: 40}}>{selectedPlan.libelle}</AppText>}

            </View>
            <AppLabelWithValue label='Delai de payement: ' labelValue={selectedPlan.nombreMensualite?selectedPlan.nombreMensualite:'cash'}
                               secondLabel={selectedPlan.nombreMensualite?'Mois':' à la livraison'}/>
             <AppLabelWithValue label="Taux d'interet: " labelValue={`${selectedPlan.compensation*100} %`} />
             <View>
                 <AppText style={{fontWeight: 'bold'}}>Description</AppText>
                 <AppText>{selectedPlan.descripPlan}</AppText>
             </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                margin: 40
            }}>
                <AppButton
                    iconName='keyboard-backspace'
                    title='retour' onPress={() => navigation.goBack()}/>
              {isPlanDisabled(selectedPlan) === false  && Object.keys(currentOrder).length>0 &&
              <AppButton title='je choisis' onPress={() => {
                    dispatch(getSelectedPlan(selectedPlan))
                    navigation.goBack()
                }}/>}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        height: 300,
        width: '100%',
        justifyContent: 'center',
        backgroundColor: colors.blanc
    },
    imageStyle: {
        height: 200,
        width: '100%'
    }

})

export default PlanDetailScreen;