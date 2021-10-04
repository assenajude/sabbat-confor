import {Alert, ToastAndroid} from 'react-native'
import {useDispatch,  useStore} from "react-redux";
import {
    getOrderContratUpdate,
    getOrderDeleted,
    saveStatusEditing
} from "../store/slices/orderSlice";
import useCreateOrderContrat from "./useCreateOrderContrat";
import {getTranchePayed} from "../store/slices/trancheSlice";
import {getFacturesByUser, getFactureUpdated} from "../store/slices/factureSlice";
import dayjs from "dayjs";

let useManageUserOder;
export default useManageUserOder = () => {
    const dispatch = useDispatch()
    const store = useStore()
    const { createContrat} = useCreateOrderContrat()

    const secsToTime = (secs) => {
        let d = secs / 8.64e4 | 0;
        let H = (secs % 8.64e4) / 3.6e3 | 0;
        let m = (secs % 3.6e3)  / 60 | 0;
        let s = secs % 60;
        let z = n=> (n < 10? '0' : '') + n;
        const jours = d>0?`${d}j` : ''
        const heures = H>0?`${z(H)}h` : ''
        const minutes = m>0?`${z(m)}m` : ''
        const seconds = s>0?`${z(s)}s` : ''
        // `${d}j ${z(H)}h${z(m)}m ${z(s)}s`
        return `${jours} ${heures} ${minutes} ${seconds}`

    }

    const saveAccordEdit = (data) => {
        dispatch(saveStatusEditing(data))
    };

    const saveLivraisonEdit = (data) => {
        dispatch(saveStatusEditing(data))
    };


    const createOrderContrat = (order) => {
        Alert.alert('Info...', 'Voulez-vous passer en contrat pour cette commande?', [
            {text: 'oui', onPress: async () => {
                    await createContrat(order)
                }},
            {
                text: 'non', onPress: () => {return;}
            }
        ], {cancelable: false})
    };

    const moveOrderToHistory = (orderId) => {
        const orderData = {
            orderId,
            history: true
        }
        Alert.alert('Info!', "Voulez-vous deplacer cette commande dans votre historique?", [
            {text: 'oui', onPress: async () => {
                    await dispatch(saveStatusEditing(orderData))
                }}, {
                text: 'non', onPress: () => {return;}
            }
        ])

    };

    const deleteOrder = (order) => {
        const contratLength = order.Contrats.length
        const lastContrat = order.Contrats[contratLength-1]
        if(lastContrat && lastContrat.montant !== order.Facture.solde) {
            Alert.alert('Info!', 'Vous ne pouvez pas supprimer cette commande car le contrat nest pas encore terminé', [
                {text: 'ok', onPress: () => {return;}}
            ])
        } else {
            Alert.alert('Info!', 'Voulez-vous  supprimer cette commande definitivement?', [
                {text: 'oui', onPress: async () => {
                     await dispatch(getOrderDeleted(order))
                        const error = store.getState().entities.order.error
                        if(error !== null) {
                            return ToastAndroid.showWithGravity('Une erreur est apparue', ToastAndroid.LONG, ToastAndroid.TOP)
                        }
                        return ToastAndroid.showWithGravity('la commande a été supprimée avec succes', ToastAndroid.LONG, ToastAndroid.TOP)
                }},
                {text: 'non', onPress: () => {return;}}
            ])
        }

    }


    const payFactureTranche = async (tranche) => {
        await dispatch(getTranchePayed(tranche))
        const error = store.getState().entities.tranche.error
        if(error !== null) {
            return alert('Impossible de payer la tranche.Veuillez reessayer plutard')
        } else {
            if(tranche.validation){
                dispatch(getFacturesByUser())
                return alert("La tranche a été validée")
            }
            const factureData = {
                id: tranche.FactureId,
                solde: tranche.montant
            }
            await dispatch(getFactureUpdated(factureData))
            const list = store.getState().entities.facture.list
            const justUpdated = list.find(fact => fact.id === tranche.FactureId)
            if(justUpdated.montant === justUpdated.solde) {
                dispatch(getOrderContratUpdate({
                    commandeId: justUpdated.CommandeId,
                    contratStatus: 'Terminé',
                    dateCloture: Date.now()
                }))
            }
            ToastAndroid.showWithGravity("Tranche payée avec succès", ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }

    const getOrderExpirationState = (order) => {
        if(!order.accordValidationDate)return;

        let leftTime;
        const startDateDay = dayjs(order.accordValidationDate).get('day')
        const lastTime = dayjs(order.accordValidationDate).set('day', startDateDay + 3)
        const now = dayjs()
        leftTime = lastTime.diff(now, 'second')
        return leftTime

    }

return {secsToTime,saveAccordEdit, saveLivraisonEdit, createOrderContrat, moveOrderToHistory, deleteOrder, payFactureTranche, getOrderExpirationState}
}