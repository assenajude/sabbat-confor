import {useSelector, useStore} from "react-redux";
import dayjs from "dayjs";

let useOrderInfos;
export default useOrderInfos = () => {
    const store = useStore()
    const listOrder = useSelector(state => state.entities.order.currentUserOrders)
    const listPayement = useSelector(state => state.entities.payement.list)
    const listRelais = useSelector(state => state.entities.pointRelais.list)

    const getItems = (orderId) => {
        const selectedOrder = listOrder.find(order => order.id === orderId)
        if(selectedOrder) return selectedOrder.CartItems
        return null
    }

    const getModePayement = (orderId) => {
        const selectedOrder = listOrder.find(order => order.id === orderId)
        if(selectedOrder) {
            const idPayement = selectedOrder.Plan.PayementId
            const selectedPayement = listPayement.find(payement => payement.id === idPayement)
            if(selectedPayement) return selectedPayement.mode
            return null
        }
    }

    const getPointRelais = (orderId) => {
        const selectedOrder = listOrder.find(order => order.id === orderId)
        if(selectedOrder) {
            const idRelais = selectedOrder.UserAdresse.PointRelaiId
            const selectedRelais = listRelais.find(relais => relais.id === idRelais)
            return selectedRelais
        } else return null
    }




    const getLastCompteFactureProgress = (compte) => {
        let progress = 0
        const allFacture = store.getState().entities.facture.list
        const compteOrders = compte.Commandes
        const ordersIds = compteOrders.map(item => item.id)
        const compteFacture = allFacture.filter(item => ordersIds.some(id => id === item.CommandeId))
        compteFacture.sort((a, b) => {
            if(a.createdAt > b.createdAt) return -1
            if(a.createdAt < b.createdAt) return 1
            return 0
        })
        const lastFacture = compteFacture[0]
        if(lastFacture) {
         const result = lastFacture.solde / lastFacture.montant
        const rounded = Math.round(result * 10) / 10
        progress = rounded.toFixed(1)
        }
        return Number(progress) || 0
    }

    const getOrderFactureEcheance = (order) => {
        const allFactures = store.getState().entities.facture.list
        const orderFacture = allFactures.find(fac => fac.CommandeId === order.id)
        let formatedEcheance;
        if(orderFacture) {
        const echeance = orderFacture.dateFin
        formatedEcheance = dayjs(echeance).format('DD/MM/YYYY HH:mm:ss')
        }
        return formatedEcheance || ""

    }


    return {getItems, getModePayement, getPointRelais,getLastCompteFactureProgress, getOrderFactureEcheance}
}