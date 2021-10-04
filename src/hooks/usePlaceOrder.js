import {useSelector} from "react-redux";

let usePlaceOrder;
export default usePlaceOrder = () => {
    const user = useSelector(state => state.profile.connectedUser)
    const currentOrder = useSelector(state => state.entities.order.currentOrder)
    const currentPlan = useSelector(state => state.entities.payement.currentPlan)
    const selectedVille = useSelector(state => state.entities.ville.userVille)
    const isPlanSelected = Object.keys(currentPlan).length>0

    const getShippingRate = () => {
        let shippingRate;
        shippingRate = selectedVille.prixKilo * selectedVille.kilometrage
        return shippingRate || 0
    }

    const getPayementRate = () => {
        let payementRate;
        if(isPlanSelected) {
            if(currentPlan.libelle.toLowerCase() === 'cash back') {
                if(user.cashback>currentOrder.amount+getShippingRate()) {
                    payementRate = -(currentOrder.amount+getShippingRate())
                }else payementRate = - user.cashback
            }else{
                payementRate = -(currentOrder.amount * currentPlan.compensation)
            }
        }
        return payementRate??0
    }



    const getTauxPercent = () => {
        const selectedPlanCompens = currentPlan.compensation
        return selectedPlanCompens * 100 || 0
    }

    const getTotal = () => {
        const payementFees = getPayementRate()
        const shippingFees = getShippingRate()
        let total;
        if(isPlanSelected && currentPlan.libelle.toLowerCase() === 'cash prime') {
            total= currentOrder.amount + shippingFees
        }else {
            total= currentOrder.amount + shippingFees + payementFees;
        }

      /*  if(isPlanSelected && currentPlan.libelle.toLowerCase() === 'cash prime') {
            total = currentOrder.amount + shippingFees
        }else if(isPlanSelected && currentPlan.libelle.toLowerCase() === 'cash back') {
            if(user.cashback>currentOrder.amount + shippingFees) {

            }
         total = currentOrder.amount + shippingFees - user.cashback
        }else {
            total = currentOrder.amount + payementFees + shippingFees
        }*/
        return total??0
    }

    return {getPayementRate, getShippingRate, getTauxPercent, getTotal}
}