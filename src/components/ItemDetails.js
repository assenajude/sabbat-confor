import React from 'react';
import {Image, ScrollView, StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import AppButton from "./AppButton";
import colors from "../utilities/colors";
import AppText from "./AppText";
import AppLabelLink from "./AppLabelLink";
import useAuth from "../hooks/useAuth";

function ItemDetails({firstOptions, secondOptions, selectedImage,
                         selectedFirstOption, selectedSecondOption, selectedQty,
                         changeImage, addItemToCart, editItem, deleteItem, addOption, itemImages,
                         itemLibelle, itemFirstPrice, itemSecondPrice, itemStockQte, FirstOptionDispatch, secondOptionDispatch,
                         decrementQte, incrementQte, itemDescription}) {
    const {userRoleAdmin} = useAuth()

    return (
        <>
            <ScrollView style={{marginTop: 20}}>
                {userRoleAdmin() &&  <View style={{
                    alignSelf: 'flex-end',
                    marginBottom: 20
                }}>
                    <View>
                        <AppButton title='Edit' iconName='edit' iconSize={15} iconColor={colors.blanc} onPress={editItem}/>
                        <AppButton onPress={deleteItem} style={{marginTop: 10}}  title='Supprimer' iconName='delete' iconSize={15} iconColor={colors.blanc}/>
                        <AppButton style={{marginTop: 10}} title='Add option' iconName='plus' iconSize={15} iconColor={colors.blanc} onPress={addOption}/>
                    </View>
                </View>}
                <View style={{margin: 5}}>
                    <Image source={{uri: selectedImage}} style={styles.imageStyle}/>
                </View>
                <ScrollView horizontal>
                    <View style={styles.imagesContainer}>
                        {itemImages.map((image, index) => <View key={index.toString()} style={{margin: 10}}>
                            <TouchableWithoutFeedback onPress={() => changeImage(image)}>
                                <Image source={{uri: image}} style={{height: 60, width: 60}} />
                            </TouchableWithoutFeedback>
                        </View>)}
                    </View>
                </ScrollView>
                <View style={{margin: 5}}>
                    <View style={{ marginTop: 5}}>
                        <AppText style={{fontWeight: 'bold'}}>{itemLibelle}</AppText>
                    </View>
                    <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row'}}>
                            <AppText style={{fontWeight: 'bold'}}>Prix: </AppText>
                            <AppText style={{fontWeight: 'bold', color: colors.rougeBordeau}}>{itemFirstPrice}</AppText>
                            <AppText>/</AppText>
                            <AppText style={{textDecorationLine: 'line-through'}}>{itemSecondPrice}</AppText>
                            <AppText>fcfa</AppText>
                        </View>
                        <View style={{
                            alignSelf: 'flex-end'
                        }}>
                            <AppButton style={{padding: 5}} title='Acheter' onPress={addItemToCart}/>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <AppText style={{fontWeight: 'bold'}}>Reste en stock: </AppText>
                        <AppText style={{fontWeight: 'bold', color: colors.rougeBordeau}}>{itemStockQte}</AppText>
                    </View>
                    {firstOptions.length >= 1 && <View style={{flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0.5}}>
                        <View style={{borderWidth: 1}}>
                            <View style={{backgroundColor: colors.rougeBordeau}}>
                                <AppText style={{color: colors.blanc}}>Choisissez une option</AppText>
                            </View>
                            <View style={{width: 200}}>
                                <ScrollView horizontal>
                                    <View style={{flexDirection: 'row'}}>
                                        {firstOptions.map((couleur, index) => <View key={index.toString()} style={{padding:5}}>
                                            <AppLabelLink containerStyle={{borderWidth: 1,
                                                borderColor: selectedFirstOption === couleur?colors.or:'grey'
                                            }} otherTextStyle={{marginTop: 10}} content={couleur}
                                                          handleLink={FirstOptionDispatch}/>
                                        </View>)}
                                    </View>
                                </ScrollView>
                            </View>

                            {selectedFirstOption !== '' && secondOptions.length >= 1 &&  <View>
                                <View style={{backgroundColor: colors.rougeBordeau}}>
                                    <AppText style={{color: colors.blanc}}>Choisissez une taille svp</AppText>
                                </View>
                                <ScrollView horizontal>
                                    {secondOptions.map((taille, index) =>
                                        <AppLabelLink key={index} containerStyle={{
                                            borderWidth: 1,
                                            borderColor: selectedSecondOption === taille?colors.or:'grey'
                                        }} content={taille}
                                                      handleLink={secondOptionDispatch}/>)}
                                </ScrollView>
                            </View>}
                        </View>

                        <View style={{height: 'auto', width: '50%'}}>
                            <View style={{
                                backgroundColor: colors.rougeBordeau
                            }}>
                                <AppText style={{color: colors.blanc}}>Vos choix</AppText>
                            </View>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <AppText>couleur: </AppText>
                                <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>{selectedFirstOption}</AppText>
                            </View>

                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <AppText>size: </AppText>
                                <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>{selectedSecondOption}</AppText>
                            </View>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <AppText>Prix: </AppText>
                                <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>{selectedSecondOption.prix} fcfa</AppText>
                            </View>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <AppText>Quantite: </AppText>
                                <AppButton iconName='minus' iconColor={colors.blanc}
                                           onPress={decrementQte}
                                           disableButton={selectedQty === 0}/>
                                <AppText>{selectedQty}</AppText>
                                <AppButton iconName='plus' iconColor={colors.blanc}
                                           onPress={incrementQte}/>
                            </View>
                        </View>
                    </View>}
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <AppText style={{fontWeight: 'bold'}}>Description: </AppText>
                        <AppText>{itemDescription}</AppText>
                    </View>
                </View>

            </ScrollView>

        </>
    );
}

const styles = StyleSheet.create({
    imageStyle: {
        height: 200,
        width: '100%',
        padding: 10,
        overflow: 'hidden'
    },
    imagesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default ItemDetails;