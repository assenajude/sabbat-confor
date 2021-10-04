import React, {useState} from 'react';
import {Image, ScrollView, StyleSheet,TouchableWithoutFeedback, View} from "react-native";
import AppText from "../components/AppText";
import {useDispatch, useSelector} from "react-redux";
import {getColorSizes, getSelectOption} from "../store/slices/mainSlice";
import useAddToCart from "../hooks/useAddToCart";
import colors from "../utilities/colors";
import AppLabelLink from "../components/AppLabelLink";
import AddToCartModal from "../components/shoppingCart/AddToCartModal";
import routes from "../navigation/routes";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useAuth from "../hooks/useAuth";
import AppLabelWithContent from "../components/AppLabelWithContent";
import AppLabelWithValue from "../components/AppLabelWithValue";
import AppButton from "../components/AppButton";
import AddToCartButton from "../components/shoppingCart/AddToCartButton";

function LocationDetailScreen({route, navigation}) {
    const dispatch = useDispatch()
    const {addItemToCart} = useAddToCart()
    const {userRoleAdmin} = useAuth()

    const item = useSelector(state => {
        const listLocation = state.entities.location.list
        const selectedLocation = listLocation.find(item => item.id === Number(route.params.id))
        return selectedLocation
    })

    const [showItemModal,  setShowModal] = useState(false)
    const [addedItem, setAddedItem] = useState({})
    const isLoading = useSelector(state => state.entities.shoppingCart.loading)
    const locationOptions = useSelector(state => state.entities.main.selectedItemOptions)
    const locationOptionSises = useSelector(state => state.entities.main.selectedColorSizes)
    const locSelectedOption = useSelector(state => state.entities.main.selectedOption)
    const [selectedImage, setSelectedImage] = useState(item.imagesLocation[0])
    const [selectedColor, setSelectedColor] = useState('')
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedQty, setSelectedQty] = useState(1)

    const handleChangeImage = (image) => {
        setSelectedImage(image)
    }

    const handleAddToCart = async () => {
        const isLocationSelected = selectedColor !== '' && selectedSize !== ''
        if(item.ProductOptions.length>0 && !isLocationSelected) {
            return alert('Vous devez choisir une option pour valider.')
        }
    const itemData = {...item, couleur: selectedColor, prix: locSelectedOption.prix, taille: selectedSize, quantite: selectedQty}
        const result = await addItemToCart(itemData)
        if(!result) return;
        setAddedItem(item)
        setShowModal(true)
    }


    if(!item) {
        return <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <AppText>Cet article n'est plus en stock</AppText>
        </View>
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            <ScrollView contentContainerStyle={{
                paddingBottom: 50
            }}
            >
                {userRoleAdmin() &&  <View style={{
                    alignSelf: 'flex-end',
                    marginBottom: 20
                }}>
                    <View>
                            <AppButton
                                iconName='circle-edit-outline'
                                title='Edit'
                                onPress={() => navigation.navigate('E-location', {screen: 'NewLocationScreen', params: item})}
                            />
                            <AppButton
                                iconName='plus'
                                onPress={() => navigation.navigate('NewOptionScreen', item)}
                                title='Add option'/>
                    </View>
                </View>}
                <View>
                    <Image source={{uri: selectedImage}} style={styles.imageStyle}/>
                </View>
                <ScrollView horizontal>
                        {item.imagesLocation.map((image, index) => <View key={index.toString()} style={{margin: 10}}>
                            <TouchableWithoutFeedback onPress={() => handleChangeImage(image)}>
                                <Image source={{uri: image}} style={{height: 60, width: 60}} />
                            </TouchableWithoutFeedback>
                        </View>)}
                </ScrollView>
                <View style={{margin: 5}}>
                    <View style={{ marginTop: 5}}>
                        <AppText style={{fontWeight: 'bold'}}>{item.libelleLocation}</AppText>
                    </View>
                    <AddToCartButton
                        style={{
                            marginVertical: 20,
                            marginHorizontal:10,
                            alignSelf: 'flex-end'
                        }}
                        onPress={handleAddToCart}
                        label='Louer'
                    />
                    <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row'}}>
                            <AppText style={{fontWeight: 'bold'}}>Prix: </AppText>
                            <AppText style={{fontWeight: 'bold', color: colors.rougeBordeau}}>{item.coutPromo}</AppText>
                            <AppText>/</AppText>
                            <AppText style={{textDecorationLine: 'line-through'}}>{item.coutReel}</AppText>
                            <AppText>fcfa</AppText>
                        </View>
                    </View>
                    <AppLabelWithValue label='Reste en stock:' labelValue={item.qteDispo}/>
                    <AppLabelWithValue label='Frequence Payement:' labelValue={item.frequenceLocation}/>
                    <AppLabelWithValue label='Caution:' labelValue={item.nombreCaution}/>
                    <AppLabelWithContent
                        label='Situation géographique'
                        content={item.adresseLocation}
                    />
                    {locationOptions.length >= 1 &&
                    <View style={{borderWidth: 0.5}}>
                        <View style={{borderWidth: 1}}>
                            <View style={{backgroundColor: colors.rougeBordeau}}>
                                <AppText style={{color: colors.blanc}}>Choisissez une option</AppText>
                            </View>
                            <View style={{width: 200}}>
                                <ScrollView horizontal>
                                    <View style={{flexDirection: 'row'}}>
                                        {locationOptions.map((couleur, index) => <View key={index.toString()} style={{padding:5}}>
                                            <AppLabelLink containerStyle={{borderWidth: 1,
                                                borderColor: selectedColor === couleur?colors.or:'grey'
                                            }} otherTextStyle={{marginTop: 10}} content={couleur}
                                                          handleLink={() => {
                                                              dispatch(getColorSizes({item, couleur}));
                                                              setSelectedColor(couleur)
                                                              setSelectedSize('')
                                                          }}/>
                                        </View>)}
                                    </View>
                                </ScrollView>
                            </View>

                            {selectedColor !== '' && locationOptionSises.length >= 1 &&  <View>
                                <View style={{backgroundColor: colors.rougeBordeau}}>
                                    <AppText style={{color: colors.blanc}}>Choisissez une taille svp</AppText>
                                </View>
                                <ScrollView horizontal>
                                    {locationOptionSises.map((taille, index) =>
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
                                <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>{locSelectedOption.prix}fcfa</AppText>
                            </View>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <AppText>Quantite: </AppText>
                                <AppText>{selectedQty}</AppText>
                            </View>
                        </View>
                    </View>}
                    <AppLabelWithContent
                        showSeparator={false}
                        label="Description" content={item.descripLocation}/>
                </View>
            </ScrollView>

            {item.qteDispo === 0 && <View style={styles.rupture}>
                <AppText style={{color: colors.rougeBordeau}}>Rupture de stock</AppText>
            </View>}
            {showItemModal && <AddToCartModal
                cartHeight={'100%'}
                itemModalVisible={showItemModal}
                source={{uri: addedItem.imagesLocation[0]}}
                designation={addedItem.libelleLocation}
                goToHomeScreen={() => setShowModal(false)}
                goToShoppingCart={() => {
                    setShowModal(false)
                    navigation.navigate('AccueilNavigator', {screen: routes.CART})}}/>}
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
        position:'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
        backgroundColor: colors.blanc
    }
})

export default LocationDetailScreen;