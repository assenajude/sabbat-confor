import {useSelector, useStore} from "react-redux";

let payementPlan;
export default payementPlan = () => {
    const store = useStore()
    const currentOrder = useSelector(state => state.entities.order.currentOrder)
    const user = useSelector(state => state.auth.user)


    const permitCredit = () => {
        const orderItems = store.getState().entities.order.currentOrder.items
        let isCreditAllow = true
        orderItems.forEach(item => {
            if (!item.aide) isCreditAllow = false
        })
        return isCreditAllow
    }


    const permitPlan = () => {
        let planMensualite = 0
        if(currentOrder.amount <= 10000) {
            planMensualite = 1
        }
        if(currentOrder.amount>10000 && currentOrder.amount <= 50000) {
            planMensualite = 2
        }
        if(currentOrder.amount> 50000 && currentOrder.amount<=100000) {
            planMensualite = 3
        }
        if(currentOrder.amount>100000 && currentOrder.amount<=500000) {
            planMensualite = 4
        }
        if(currentOrder.amount>500000 && currentOrder<=1000000) {
            planMensualite = 5
        }
        if(currentOrder.amount>1000000 && currentOrder.amount<=1200000){
            planMensualite = 6
        }
        if(currentOrder.amount>1200000 && currentOrder.amount<=1500000){
            planMensualite = 7
        }
        if(currentOrder.amount>1500000 && currentOrder.amount<=1700000){
            planMensualite = 8
        }
        if(currentOrder.amount>1700000 && currentOrder.amount<=1900000){
            planMensualite = 9
        }
        if(currentOrder.amount>1900000 && currentOrder.amount<=2000000){
            planMensualite = 10
        }
        if(currentOrder.amount>2000000){
            planMensualite = 12
        }
        return planMensualite
    }



    const isPlanDisabled = (selectedPlan) => {
        const isDisabled =  selectedPlan.libelle.toLowerCase() === 'le bon samaritain' && !user.isHero || selectedPlan.nombreMensualite > permitPlan()
        if(isDisabled) return true
        return false
    }

    return {permitCredit, permitPlan, isPlanDisabled}
}