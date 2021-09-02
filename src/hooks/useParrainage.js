import {useSelector} from "react-redux";

let useParrainage;
export default useParrainage = () => {
    const parrainageOrders = useSelector(state => state.entities.parrainage.parrainageOrders)

    const getParrainagePercent = (total, amount) => {
        const percent = amount * 100 / total
        const formated = Math.round(percent)
        return formated || 0
    }

    const getParrainageGain = (order) => {
        const parrainageAmount = order.OrderParrain.action
        const montantParraine = order.montant - order.interet
        const percent = getParrainagePercent(montantParraine, parrainageAmount)
        const result = percent * order.interet / 100
        const gain = Math.round(result)
        return gain || 0

    }

    const getTotalGain = () => {
        let total = 0
        parrainageOrders.forEach(order => {
            const gainPerOrder = getParrainageGain(order)
            total += gainPerOrder
        })
        return total || 0
    }

    const getInvestissement = () => {
        let totalAction = 0
        parrainageOrders.forEach(order => {
            totalAction += order.OrderParrain.action
        })
        return totalAction || 0
    }

    const getRestituteInvest = () => {
        let restituteQuotite = 0
        let actuGain = 0
        const endedOrder = parrainageOrders.filter(order => order.OrderParrain.ended === true)
        endedOrder.forEach(order => {
            restituteQuotite += order.OrderParrain.action
            const gain = getParrainageGain(order)
            actuGain += gain
        })
        return {restituteQuotite, actuGain}
    }

    const getFilleulOrders = (filleul) => {
        let selectedOrders = []
         selectedOrders = parrainageOrders.filter(order => order.UserId === filleul.UserId)
        return selectedOrders

    }


return  {getInvestissement, getParrainageGain, getParrainagePercent, getTotalGain, getRestituteInvest, getFilleulOrders}
}