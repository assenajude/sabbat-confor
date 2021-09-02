let useItemReductionPercent;
export default useItemReductionPercent = () => {
    const getReductionPercent = (item) => {
        let percent = 0
        let difference = 0
       if(item.Categorie.typeCateg === 'article') {
           difference = item.prixReel - item.prixPromo
           percent = difference * 100 / item.prixReel
       } else if(item.Categorie.typeCateg === 'location'){
           difference = item.coutReel - item.coutPromo
           percent = difference * 100 / item.coutReel
       }
       return Math.ceil(percent)
    }
    return {getReductionPercent}
}