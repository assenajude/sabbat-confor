import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector, useStore} from 'react-redux'
import {View, FlatList, StyleSheet, Alert, ToastAndroid} from 'react-native';

import ListFooter from "../components/list/ListFooter";
import routes from '../navigation/routes'
import PlanListItem from "../components/plan/PlanListItem";
import AppText from "../components/AppText";
import useAuth from "../hooks/useAuth";
import AppItemPicker from "../components/AppItemPicker";
import {deleteOnePlan} from "../store/slices/planSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";

function PlanScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const {userRoleAdmin} = useAuth()

    const payements = useSelector(state => state.entities.payement.list);
    const loading = useSelector(state => state.entities.plan.loading)
    const listPlan = useSelector(state => state.entities.plan.list)
    const [currentPayement, setCurrentPayement] = useState(payements[0]?.mode);
    const [planData, setPlanData] = useState([])

    const getPlanData = () => {
        const newList = listPlan.filter(plan => plan.Payement.mode.toLowerCase() === currentPayement.toLowerCase())
        setPlanData(newList)
    }

    const handleDeletePlan = (plan) => {
        Alert.alert("Attention", "Voulez-vous supprimer definitivement cet plan?", [
            {text: 'non', onPress: () => {return;}},
            {text: "oui", onPress: async () => {
                await dispatch(deleteOnePlan({planId: plan.id}))
                    const error = store.getState().entities.plan.error
                    if(error !== null) {
                        alert("Impossible de supprimer cet plan")
                    }else {
                        ToastAndroid.showWithGravity("Plan supprimé avec succès", ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                }}
        ])
    }

    useEffect(() => {
        getPlanData()
    }, [currentPayement])

    return (
        <>
            <AppActivityIndicator visible={loading}/>
            <AppItemPicker
                style={{width: 150}}
                onValueChange={val => setCurrentPayement(val)}
                selectedValue={currentPayement}
                label='Mode de payement: '
                items={payements.map(item => item.mode)}/>
           {planData.length>0 && <FlatList data={planData} keyExtractor={item => item.id.toString()}
            renderItem={({item}) =>
                <PlanListItem
                    deletePlan={() => handleDeletePlan(item)}
                    editPlan={() => navigation.navigate('AccueilNavigator',{screen: routes.NEW_PLAN, params: item})}
                    planImage={{uri: item.imagesPlan[0]}} imageDispo={item.imagesPlan.length>0}
                    label={item.libelle} description={item.descripPlan}
                    getPlanDetail={() => navigation.navigate('AccueilNavigator', {screen: 'PlanDetailScreen', params: item})}
                />}
            />}
            {planData.length === 0 && <View style={styles.emptyPlans}><AppText>Aucun plan trouvé</AppText></View>}

            {userRoleAdmin() && <View style={styles.addButton}>
                <ListFooter onPress={() =>navigation.navigate('AccueilNavigator',{screen: routes.NEW_PLAN})}/>
            </View>}
       </>
);
}

const styles = StyleSheet.create({
    container: {
       flex: 1,
        paddingTop: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addButton: {
        width: 60,
        height: 60,
        alignSelf: 'flex-end',
        bottom: 15,
        right: 15
    },
    emptyPlans: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    payementStyle: {
        flexDirection: 'row',
        top: 20,
        marginVertical: 20
    }

})

export default PlanScreen;