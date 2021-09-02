import {useSelector} from "react-redux";

let usePlaceOrder;
export default usePlaceOrder = () => {
    const currentOrder = useSelector(state => state.entities.order.currentOrder)
    const currentPlan = useSelector(state => state.entities.payement.currentPlan)
    const selectedVille = useSelector(state => state.entities.ville.userVille)

    const getPayementRate = () => {
        let payementRate;
        payementRate = currentOrder.amount * currentPlan.compensation
        return payementRate || 0
    }

    const getShippingRate = () => {
        let shippingRate;
        shippingRate = selectedVille.prixKilo * selectedVille.kilometrage
        return shippingRate || 0
    }

    const getTauxPercent = () => {
        const selectedPlanCompens = currentPlan.compensation
        return selectedPlanCompens * 100 || 0
    }

    const getTotal = () => {
        const payementFees = getPayementRate()
        const shippingFees = getShippingRate()
        const total = currentOrder.amount + payementFees + shippingFees
        return total || 0
    }

    return {getPayementRate, getShippingRate, getTauxPercent, getTotal}
}