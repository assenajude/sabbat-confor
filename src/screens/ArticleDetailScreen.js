import React, {useState} from 'react';
import {ScrollView, View,StyleSheet, Image, TouchableWithoutFeedback} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import colors from "../utilities/colors";
import AppText from "../components/AppText";
import AppLabelLink from "../components/AppLabelLink";
import {getColorSizes, getSelectOption} from "../store/slices/mainSlice";
import useAddToCart from "../hooks/useAddToCart";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AddToCartModal from "../components/shoppingCart/AddToCartModal";
import routes from "../navigation/routes";
import useAuth from "../hooks/useAuth";
import AppLabelWithValue from "../components/AppLabelWithValue";
import AppLabelWithContent from "../components/AppLabelWithContent";
import AppIconButton from "../components/AppIconButton";
import AppButton from "../components/AppButton";
import AddToCartButton from "../components/shoppingCart/AddToCartButton";

function ArticleDetailScreen({route, navigation}) {
    const dispatch = useDispatch()
    const {addItemToCart} = useAddToCart()
    const {userRoleAdmin} = useAuth()


    const item = useSelector(state => {
        const listArticles = state.entities.article.availableArticles
        const currentArticle = listArticles.find(article => article.id === Number(route.params.id))
        return currentArticle
    })

    const colorOptions = useSelector(state => state.entities.main.selectedItemOptions)
    const optionSizes = useSelector(state => state.entities.main.selectedColorSizes)
    const selectedOption = useSelector(state => state.entities.main.selectedOption)
    const [showModal, setShowModal] = useState(false)
    const isLoading = useSelector(state => state.entities.shoppingCart.loading)
    const [addedItem, setAddedItem] = useState({})
    const [selectedImage, setSelectedImage] = useState(item.imagesArticle[0])
    const [selectedColor, setSelectedColor] = useState('')
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedQty, setSelectedQty] = useState(1)

    const handleChangeImage = (image) => {
        setSelectedImage(image)
    }

    const handleAddToCart = async () => {
        const isOptionSelected = selectedColor !=='' && selectedSize !==''
        if(item.ProductOptions.length>0 && !isOptionSelected) {
            return alert('Veuillez choisir une option SVP.')
        }
     const itemData = {...item, prix: selectedOption.prix, couleur: selectedColor, taille: selectedSize,quantite: selectedQty}
        const result = await addItemToCart(itemData)
        if(!result) return;
        setAddedItem(itemData)
        setShowModal(true)
    }


    if(!item) {
        return <View style={{
            flex:  1,
            alignItems: "center",
            justifyContent: 'center'
        }}>
            <AppText>Cet article n'est plus en stock</AppText>
        </View>
    }
    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView
            contentContainerStyle={{
                paddingBottom:50
            }}>
           {userRoleAdmin() &&  <View style={{
                alignSelf: 'flex-end',
                marginBottom: 20
            }}>
               <View>
                   <AppButton
                       title='Edit'
                       iconName='circle-edit-outline'
                       onPress={() => navigation.navigate('E-commerce', {screen: 'NewArticleScreen', params: item})}
                   />
                    <AppButton
                        title='add option'
                        iconName='plus'
                        onPress={() => navigation.navigate('NewOptionScreen', item)}
                    />
               </View>
            </View>}
            <View style={{margin: 5}}>
            <Image source={{uri: selectedImage}} style={styles.imageStyle}/>
            </View>
            <ScrollView contentContainerStyle={{
                borderWidth: 1
            }} horizontal>
                {item.imagesArticle.map((image, index) => <View key={index.toString()} style={{margin: 10}}>
                    <TouchableWithoutFeedback onPress={() => handleChangeImage(image)}>
                    <Image source={{uri: image}} style={{height: 60, width: 60}} />
                    </TouchableWithoutFeedback>
                </View>)}
            </ScrollView>
            <View style={{margin: 5}}>
                <View style={{ marginTop: 5}}>
                    <AppText style={{fontWeight: 'bold'}}>{item.designArticle}</AppText>
                </View>
                <AddToCartButton
                    style={{
                        alignSelf: 'flex-end',
                        marginVertical: 20,
                        marginHorizontal: 10
                    }}
                    onPress={handleAddToCart}
                    label='Acheter'
                />
                <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row'}}>
                    <AppText style={{fontWeight: 'bold'}}>Prix: </AppText>
                    <AppText style={{fontWeight: 'bold', color: colors.rougeBordeau}}>{item.prixPromo}</AppText>
                    <AppText>/</AppText>
                    <AppText style={{textDecorationLine: 'line-through'}}>{item.prixReel}</AppText>
                    <AppText>fcfa</AppText>
                    </View>
                </View>
                <AppLabelWithValue label='Reste en stock:' labelValue={item.qteStock} />

                {colorOptions.length >= 1 &&
                <View style={{ borderWidth: 0.5}}>
                    <View style={{borderWidth: 1}}>
                        <View style={{backgroundColor: colors.rougeBordeau}}>
                            <AppText style={{color: colors.blanc}}>Choisissez une option</AppText>
                        </View>
                        <View style={{width: 200}}>
                        <ScrollView horizontal>
                            <View style={{flexDirection: 'row'}}>
                            {colorOptions.map((couleur, index) => <View key={index.toString()} style={{padding:5}}>
                                <AppLabelLink containerStyle={{borderWidth: 1,
                                            borderColor: selectedColor === couleur?colors.or:'grey'
                                }} otherTextStyle={{marginTop: 10}} content={couleur}
                                              handleLink={() => {
                                                  dispatch(getColorSizes({item, couleur}))
                                                  setSelectedColor(couleur)
                                                  setSelectedSize('')
                                              }}/>
                            </View>)}
                            </View>
                        </ScrollView>
                        </View>

                       {selectedColor !== '' && optionSizes.length >= 1 &&  <View>
                            <View style={{backgroundColor: colors.rougeBordeau}}>
                                <AppText style={{color: colors.blanc}}>Choisissez une taille svp</AppText>
                            </View>
                           <ScrollView horizontal>
                            {optionSizes.map((taille, index) =>
                                <AppLabelLink key={index} containerStyle={{
                                              borderWidth: 1,
                                              borderColor: selectedSize === taille?colors.or:'grey'
                                              }} content={taille}
                                              handleLink={()=> {
                                              setSelectedSize(taille)
                                              dispatch(getSelectOption({item, couleur: selectedColor, taille}))
                                              }}/>)}
                           </ScrollView>
                        </View>}
                    </View>
                    <View style={{height: 'auto', width: '100%'}}>
                        <View style={{
                            backgroundColor: colors.rougeBordeau
                        }}>
                            <AppText style={{color: colors.blanc}}>Vos choix</AppText>
                        </View>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <AppText>couleur: </AppText>
                            <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>{selectedColor}</AppText>
                        </View>

                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <AppText>size: </AppText>
                            <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>{selectedSize}</AppText>
                        </View>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <AppText>Prix: </AppText>
                            <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>{selectedOption.prix} fcfa</AppText>
                        </View>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <AppText>Quantite: </AppText>
                            <AppIconButton
                                iconColor={colors.bleuFbi}
                                iconName='minus'
                                onPress={() => {
                                    if(selectedQty === 0) return;
                                    setSelectedQty(selectedQty-1)
                                }}
                            />
                            <AppText>{selectedQty}</AppText>
                            <AppIconButton
                                iconName='plus'
                                iconColor={colors.bleuFbi}
                                onPress={() => setSelectedQty(selectedQty+1)}/>
                        </View>
                    </View>
                </View>}
                <AppLabelWithContent showSeparator={false}
                    label='Description'
                    content={item.descripArticle}/>
            </View>

        </ScrollView>

           {item.qteStock === 0 && <View style={styles.rupture}>
                <AppText style={{color: colors.rougeBordeau}}>Rupture de stock</AppText>
            </View>}
            {showModal && <AddToCartModal
                cartHeight={'100%'}
                itemModalVisible={showModal} source={{uri: addedItem.imagesArticle[0]}} designation={addedItem.designArticle}
                goToHomeScreen={() => setShowModal(false)}
                goToShoppingCart={() => {
                    setShowModal(false)
                    navigation.navigate('AccueilNavigator', {screen: routes.CART})
                }}/>}
        </>
    );
}

const styles = StyleSheet.create({
    imageStyle: {
        height: 300,
        width: '100%',
        overflow: 'hidden'
    },
    rupture: {
        position: 'absolute',
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: colors.blanc,
        opacity: 0.5,
        width: '100%',
        height: '100%'
    }
})
export default ArticleDetailScreen;