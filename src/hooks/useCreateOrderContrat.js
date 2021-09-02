import {useStore, useDispatch} from "react-redux";
import {Alert} from 'react-native'
import {addFacture, getFacturesByUser} from "../store/slices/factureSlice";
import {addTranche} from "../store/slices/trancheSlice";
import {createOrderContrat} from "../store/slices/orderSlice";
import useOrderInfos from "./useOrderInfos";
import {getConnectedUserData} from "../store/slices/userProfileSlice";

let useCreateOrderContrat;
export default useCreateOrderContrat = () => {
    const {getModePayement} = useOrderInfos()
    const store = useStore()
    const dispatch = useDispatch()
    
    const createContrat = async (order) => {
        const orderPlan = order.Plan
        const modePayement = getModePayement(order.id)
        let dateFin = new Date()
        const moisDateFin = dateFin.getMonth() + orderPlan.nombreMensualite
        const jourDateFin = dateFin.getDate()
        dateFin.setDate(jourDateFin+3)
        dateFin.setMonth(moisDateFin)
        let factureData = {
            orderId: order.id,
            debut: Date.now(),
            fin: dateFin.getTime(),
            montant: order.montant,
            type: order.typeCmde
        }
        await dispatch(addFacture(factureData))

        const newFacture = store.getState().entities.facture.newAdded
        if(modePayement.toLowerCase() === 'cash') {
            let datePayementTranche = new Date()
            const moisPayement= datePayementTranche.getDate()
            datePayementTranche.setDate(moisPayement + 3)
            const trancheData = {
                factureId: newFacture.id,
                dateEmission: Date.now(),
                dateEcheance: datePayementTranche.getTime(),
                montant: order.montant
            }
            dispatch(addTranche(trancheData))
        } else if(modePayement.toLowerCase() === 'credit') {
            const montantPerTranche = order.montant / orderPlan.nombreMensualite
            for(let i=1; i<= orderPlan.nombreMensualite; i++) {
                let datePayementFin = new Date()
                let datePayementDebut = new Date()
                const moisPayement = datePayementDebut.getMonth()
                 datePayementFin.setMonth(moisPayement + i)
                 datePayementDebut.setMonth(moisPayement+i-1)
                const trancheData = {
                    factureId: newFacture.id,
                    dateEmission: datePayementDebut.getTime(),
                    dateEcheance: datePayementFin.getTime(),
                    montant: montantPerTranche
                }
                dispatch(addTranche(trancheData))
            }

        }
        const error = store.getState().entities.tranche.error
        if(error !== null) {
            Alert.alert('Erreur', 'Une erreur est apparue', [
                {text: 'ok', onPress: () => {return;}}
            ])

        } else {
            let finContrat = new Date()
            const moisFin = finContrat.getMonth()
            finContrat.setMonth(moisFin + orderPlan.nombreMensualite)
            finContrat.setDate(finContrat.getDate() + 3)
            const contratData = {
                orderId: order.id,
                debut: Date.now(),
                fin: finContrat.getTime(),
                montant: order.montant,
                nbMensualite: orderPlan.nombreMensualite
            }
            dispatch(createOrderContrat(contratData))
            dispatch(getFacturesByUser())
            dispatch(getConnectedUserData())
        }
    }
    return {createContrat}
}