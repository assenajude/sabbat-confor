import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {View, StyleSheet, ScrollView} from "react-native";
import AppInfo from "../components/AppInfo";
import routes from '../navigation/routes';
import AddToCartModal from "../components/shoppingCart/AddToCartModal";
import useAddToCart from "../hooks/useAddToCart";
import {getSelectedOptions} from "../store/slices/mainSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppCardNew from "../components/AppCardNew";
import useAuth from "../hooks/useAuth";
import colors from "../utilities/colors";
import AppText from "../components/AppText";
import AppIconButton from "../components/AppIconButton";
import useMainFeatures from "../hooks/useMainFeatures";
import ScrollHeaderComponent from "../components/ScrollHeaderComponent";
import AppSearchbar from "../components/AppSearchbar";

function AccueilScreen({navigation, route}) {
    const selectedProduct = route.params
    const dispatch = useDispatch();
    const {dataSorter} = useAuth()
    const {addItemToCart} = useAddToCart()
    const {handleDeleteProduct} = useMainFeatures()

    const isLoading = useSelector(state => state.entities.main.loading)
    const allProducts = useSelector(state => state.entities.main.list)
    const cartLoading = useSelector(state => state.entities.shoppingCart.loading)
    const [showAddToCardModal, setShowAddToCardModal] = useState(false)
    const [currentAdded, setCurrentAdded] = useState({})
    const [mainDatas, setMainDatas] = useState(allProducts)
    const [originalData, setOriginalData] = useState([])
    const [searchLabel, setSearchLabel] = useState('')
    const [searching, setSearching] = useState(false)
    const [showHeader, setShowHeader] = useState(true)

    const scrollRef = useRef()

    const handleAddToCard =  async (item) => {
        if(item.ProductOptions.length > 1) {
            dispatch(getSelectedOptions(item))
            navigation.navigate('AccueilNavigator',{screen: item.Categorie.typeCateg === 'article'?routes.ARTICLE_DETAIL : routes.LOCATION_DETAIL, params: item})
        }else {
            const result = await addItemToCart(item)
            if(result) {
                setCurrentAdded(item)
                setShowAddToCardModal(true)
            }

        }
    }

    const getCurrentProducts = () => {
        if(selectedProduct.all) {
            setMainDatas(allProducts)
        }else if(selectedProduct.products) {
            setMainDatas(selectedProduct.products)
        } else {
        const selectedList = allProducts.filter(product => product.CategorieId === selectedProduct.CategorieId)
            setMainDatas(dataSorter(selectedList))
        }
    }

    const startingSearch = (value) => {
        setSearchLabel(value)
        const searchTerme = value
        const currentList = mainDatas
        if(searchTerme.length === 0) {
            setMainDatas(originalData)
        } else {
            const filteredList = currentList.filter(product =>  {
                const designation = product.Categorie.typeCateg === 'article'?product.designArticle:product.libelleLocation
                const description = product.Categorie.typeCateg === 'article'?product.descripArticle:product.descripLocation
                const designAndDescrip = designation+' '+description
                const expression = searchTerme.toLowerCase()
                const searchResult = designAndDescrip.toLowerCase().search(expression)
                if(searchResult !== -1) return true
            })
            setMainDatas(filteredList)
        }
    }

    const handleScrolling = (nativeEvent) => {
        const position = nativeEvent.contentOffset
        if(position.x === 0 && position.y === 0) {
            setShowHeader(true)
        }else{
            setShowHeader(false)
            if(searching) {
                setSearching(false)
            }
        }
    }

    const deleteItem = async (product) => {
        await handleDeleteProduct(product)
        getCurrentProducts()
        setOriginalData(mainDatas)
    }


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if(selectedProduct) {
                getCurrentProducts()
                setOriginalData(mainDatas)
            }
        })
        return () => unsubscribe
    }, [])

    return (
        <>
            <AppActivityIndicator visible={isLoading || cartLoading}/>
            <View>
                <ScrollHeaderComponent/>
                {!showHeader && !searching &&
                <AppIconButton
                    iconColor={colors.blanc}
                    onPress={() => {
                        scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
                        setSearching(true)
                    }}
                    buttonContainer={{
                        backgroundColor: colors.rougeBordeau,
                        position: 'absolute',
                        left: '50%',
                    }}
                    iconName='text-search'/>}
            </View>
            <ScrollView
                ref={scrollRef}
                onScroll={event => handleScrolling(event.nativeEvent)}
            >
            <View style={styles.header}>
                <View style={{
                   alignItems: 'center'
                }}>
                <AppText style={{color: colors.blanc, fontSize: 24}}>{selectedProduct?.headerTitle}</AppText>
                {!searching && showHeader && <AppIconButton
                    iconColor={colors.blanc}
                    onPress={() => setSearching(true)}
                    buttonContainer={{
                        backgroundColor: colors.rougeBordeau,
                        alignSelf: 'flex-end',
                        marginHorizontal: 20
                    }}
                    iconName='text-search'
                    iconSize={30}
                />}
                    {showHeader && searching &&
                        <AppSearchbar
                            onChangeText={val => startingSearch(val)}
                            value={searchLabel}
                        />
                    }
                </View>
            </View>
            {!isLoading  && mainDatas.length === 0 &&
            <AppInfo>
                <AppText>Aucun produit trouvé.</AppText>
            </AppInfo>}
                {mainDatas.length>0 && <View>
                    {mainDatas.map((item, index) =>
                        <AppCardNew
                            item={item}
                            editItem={() => {
                                if(item.Categorie.typeCateg === 'article')navigation.navigate('E-commerce')
                                else navigation.navigate('E-location')
                            }}
                            key={index.toString()}
                        viewDetails={() => {
                            dispatch(getSelectedOptions(item))
                            navigation.navigate('AccueilNavigator',{screen:item.Categorie.typeCateg === 'article'?routes.ARTICLE_DETAIL : routes.LOCATION_DETAIL, params: item})
                        }}
                        addToCart={ () => handleAddToCard(item)}
                        deleteItem={() => deleteItem(item)}
                        />)}
                </View>
                }
            </ScrollView>
            {showAddToCardModal && <AddToCartModal
                cartHeight={'100%'}
                itemModalVisible={showAddToCardModal}
                goToHomeScreen={() => {
                    setShowAddToCardModal(false)
                }}
                goToShoppingCart={() => {
                    setShowAddToCardModal(false)
                    navigation.navigate(routes.CART)
                }}
                designation={currentAdded?.Categorie?.typeCateg === 'article'?currentAdded.designArticle : currentAdded.libelleLocation}
                source={{uri: currentAdded?.Categorie?.typeCateg === 'article'?currentAdded.imagesArticle[0] : currentAdded.imagesLocation[0]}}
            />}
                </>
    );
}


const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 130,
        backgroundColor: colors.rougeBordeau,
    },
    searchInput:{
        height: 35,
        borderRadius: 20,
        paddingHorizontal:10,
        width: 230,
        backgroundColor: colors.blanc,
    }
})
export default AccueilScreen;