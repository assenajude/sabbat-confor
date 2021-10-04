import {useDispatch, useSelector, useStore} from "react-redux";
import useAuth from "./useAuth";
import dayjs from "dayjs";
import {Alert, ToastAndroid} from "react-native";
import { getItemDeleted} from "../store/slices/mainSlice";
import {deleteOneService} from "../store/slices/serviceSlice";
import {getToggleFavorite} from "../store/slices/userFavoriteSlice";

let useMainFeatures;
export default useMainFeatures = () => {
    const {dataSorter} = useAuth()
    const store = useStore()
    const dispatch = useDispatch()
    const allProducts = useSelector(state => state.entities.main.list)
    const serviceProducts = useSelector(state => state.entities.service.searchList)
    const listCategories = useSelector(state => state.entities.categorie.list)
    const orderList = useSelector(state => state.entities.order.currentUserOrders)
    const listArticles = useSelector(state => state.entities.article.availableArticles)
    const localisations = useSelector(state => state.entities.localisation.list)
    const locations = useSelector(state => state.entities.location.list)

    const getCategorieInfos = (categorie) => {
        if(categorie) {
            const productTab = [...allProducts, ...serviceProducts]
            const categorieProducts = productTab.filter(product => product.CategorieId === categorie.id)
            let categorieProduct = {};
            let productLength = 0
            if(categorieProducts && categorieProducts.length>0) {
                productLength = categorieProducts.length
                if(categorie.typeCateg === 'article') {
                    categorieProducts.sort((a, b) => {
                        if(a.prixPromo>b.prixPromo) return 1
                        if(a.prixPromo<b.prixPromo) return -1
                        return 0
                    })
                    categorieProduct = {...categorieProducts[0],
                        firstPrice:categorieProducts[0]?.prixPromo,
                        secondPrice: categorieProducts.pop()?.prixPromo,
                        productLength
                    }
                }else if(categorie.typeCateg === 'location') {
                    categorieProducts.sort((a, b) => {
                        if(a.coutPromo>b.coutPromo) return 1
                        if(a.coutPromo<b.coutPromo) return -1
                        return 0
                    })
                    categorieProduct = {...categorieProducts[0],
                        firstPrice:categorieProducts[0]?.coutPromo,
                        secondPrice: categorieProducts.pop()?.coutPromo,
                        productLength
                    }
                }else {
                    categorieProducts.sort((a, b) => {
                        if(a.montantMin>b.montantMin) return 1
                        if(a.montantMin<b.montantMin) return -1
                        return 0
                    })
                    const lowerMontant =  categorieProducts[0]
                    categorieProducts.sort((a, b) => {
                        if(a.montantMax>b.montantMax) return 1
                        if(a.montantMax<b.montantMax) return -1
                        return 0
                    })
                    const higherMontant = categorieProducts.pop()
                    categorieProduct = {...lowerMontant,
                        firstPrice:lowerMontant.montantMin,
                        secondPrice: higherMontant.montantMax,
                        productLength
                    }
                }
            }
        return {categorieProduct}
        }
    }

    const getProductsByCategories = () => {
        const selectedCategories = listCategories.filter(item => item.typeCateg !== 'service')
        const allCategoriesProducts = []
        selectedCategories.forEach(categorie => {
            const selectedCatProd = getCategorieInfos(categorie).categorieProduct

            if(Object.keys(selectedCatProd).length>0) {
                    allCategoriesProducts.push(selectedCatProd)
            }
        })
        const newList = dataSorter(allCategoriesProducts)
        return newList
    }

    const getOrderArticleOccurence = (list, itemId)=> {
         const itemTab = list.filter(selected => selected.OrderItem.productId === itemId)
        return itemTab.length
    }

    const getBestSellerArticles = () => {
        const orderItems = orderList.map(order => order.CartItems)
        const newTab = []
        for(let item of orderItems) {
            for(let orderItem of item) {
                newTab.push(orderItem)
            }
        }
        const newArticleTab = []
        listArticles.forEach(article => {
            const lastOccur = getOrderArticleOccurence(newTab, newArticleTab[0]?.id)
            const occurLenght = getOrderArticleOccurence(newTab, article.id)
            if(occurLenght>0) {
                if(lastOccur && occurLenght > lastOccur) {
                    newArticleTab.unshift(article)
                }else {
                    newArticleTab.push(article)
                }
            }

        })

        return newArticleTab
    }

    const getFlashPromo = () => {
        const currentFlash = []
        const otherFlash = []
        const flashArticles = listArticles.filter(article => article.flashPromo === true)
            flashArticles.forEach(item => {
                if(item.debutFlash && item.finFlash) {
                     if(dayjs(item.debutFlash)<=dayjs()) {
                         currentFlash.push(item)
                     }
                if (dayjs(item.debutFlash)>dayjs()) {
                    otherFlash.push(item)
                }}
            })
        return {currentFlash, otherFlash}
    }


    const isProductAvailble = (product) => {
        let productAvailable = false
        const inStock = product.Categorie.typeCateg === 'article'?product.qteStock : product.qteDispo
        if(product.Categorie.typeCateg === 'location' && inStock>0) {
            productAvailable = true
        }else if(product.Categorie.typeCateg === 'article') {
                if(product.flashPromo === false && inStock>0) {
                    productAvailable = true
                }else {
                    const currentDate = dayjs()
                    const promoStartDate = dayjs(product.debutFlash)
                    const endPromo= dayjs(product.finFlash)
                    if(currentDate>= promoStartDate && currentDate<endPromo && inStock>0) {
                        productAvailable = true
                    }
                }

        }
        return productAvailable
    }

    const handleDeleteProduct = async (product) => {
        Alert.alert("Attention!", "Voulez-vous supprimer definitivement ce produit?", [
            {text: 'oui', onPress: async () => {
                let error;
                if(product.Categorie.typeCateg === 'service') {
                    await dispatch(deleteOneService(product))
                    error = store.getState().entities.service.error

                }else {
                    await dispatch(getItemDeleted(product))
                    error = store.getState().entities.main.error
                }

                    if(error !== null) {
                        ToastAndroid.showWithGravity('Impossible de faire la suppression', ToastAndroid.LONG, ToastAndroid.CENTER)
                    }else {
                        ToastAndroid.showWithGravity('Produit supprimé avec succès.',ToastAndroid.LONG, ToastAndroid.CENTER )
                    }
                }}, {
                text: 'non', onPress: () => {return;}
            }
        ])
    }

    const getPromoLeftTime = (endTime) => {
        let leftTime = 0
            leftTime = dayjs(endTime).diff(dayjs(), 'second')
        return leftTime
    }


    const getLocalisationLocationsLength = (localisationId) => {
        let length = 0
        const selectedLocalisation = localisations.find(item => item.id === localisationId)
        if(selectedLocalisation) {
            length = selectedLocalisation.Locations.length
        }
        return length
    }

    const getLocalisationLocations = (localisationId) => {
        const selectedLocations = locations.filter(location => location.Localisation.id === localisationId)
        return selectedLocations
    }

    const toggleFavorite = async (item) => {
        await dispatch(getToggleFavorite(item))
        const error = store.getState().entities.userFavorite.error
        if(error !== null) {
            return alert("Nous n'avons pas pu ajouter le produit à votre favoris, veuillez reessayer plutard.")
        }
        ToastAndroid.showWithGravity("Produit ajouté à vos favoris", ToastAndroid.LONG, ToastAndroid.CENTER)
    }
    return {toggleFavorite,getLocalisationLocations,getLocalisationLocationsLength, getPromoLeftTime,getCategorieInfos, getProductsByCategories, getBestSellerArticles, getFlashPromo, isProductAvailble, handleDeleteProduct}
}