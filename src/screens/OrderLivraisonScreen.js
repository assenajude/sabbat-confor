import React, {useState} from 'react';
import {useSelector, useDispatch, useStore} from "react-redux";
import {View, StyleSheet, ScrollView, TouchableWithoutFeedback} from "react-native";

import AppText from "../components/AppText";
import colors from "../utilities/colors";
import routes from "../navigation/routes";
import PayementListItem from "../components/list/PayementListItem";
import { getSelectedLivraisonVille} from '../store/slices/villeSlice'
import {getSelectedAdress, getAdLivraisonDetail} from '../store/slices/userAdresseSlice'
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppLabelWithValue from "../components/AppLabelWithValue";
import usePlaceOrder from "../hooks/usePlaceOrder";
import useAuth from "../hooks/useAuth";
import {AntDesign} from "@expo/vector-icons";
import ListFooter from "../components/list/ListFooter";

function OrderLivraisonScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const {formatPrice} = useAuth()
    const {getShippingRate, getTotal} = usePlaceOrder()
    const loading = useSelector(state => state.entities.userAdresse.loading)
    const adresseByUser = useSelector(state => state.entities.userAdresse.list);
    const currentSelected = useSelector(state => state.entities.userAdresse.selectedAdresse)
    const [persoFees, setPersoFees]  = useState(false)
    const isAdresseNotEmpty = Object.keys(currentSelected).length>0 || persoFees

    const handleSelectItem = async (item) => {
        await dispatch(getSelectedAdress(item.id))
        const selectedAd = store.getState().entities.userAdresse.selectedAdresse
        if(selectedAd.selected) {
            dispatch(getSelectedLivraisonVille(item))
            setPersoFees(false)
        }else {
            dispatch(getSelectedLivraisonVille({}))
        }
    }

    if (loading) {
        return (
            <AppActivityIndicator visible={loading}/>
        )
    }

    return (
        <>
        <View style={styles.container}>
            <View style={styles.summary}>
                <View style={styles.itemLine}>
                    <AppText style={{fontWeight: 'bold'}}>Montant actuel commande: </AppText>
                    <AppText style={{
                        fontWeight: 'bold',
                        color: colors.rougeBordeau
                    }}>{formatPrice(getTotal()-getShippingRate())}</AppText>
                </View>
                <View style={styles.itemLine}>
                    <AppText style={{fontWeight: 'bold'}}>Frais de livraison: </AppText>
                    <AppText style={{
                        fontWeight: 'bold',
                        color: colors.rougeBordeau
                    }}>{formatPrice(getShippingRate())}</AppText>
                </View>
                <View style={styles.itemLine}>
                    <AppText style={{fontWeight: 'bold'}}>Net actuel à payer: </AppText>
                    <AppText style={{
                        fontWeight: 'bold',
                        color: colors.rougeBordeau
                    }}>{formatPrice(getTotal())}</AppText>
                </View>
            </View>
            <View>
                <View style={styles.adressHeader}>
                    <AppText style={{color: colors.blanc}}>Choisissez votre adresse de livraison</AppText>
                </View>
            </View>
                <ScrollView>
                    <View style={{
                        paddingLeft: 20,
                        borderBottomWidth: 1,
                        paddingBottom: 10
                    }}>
                        <TouchableWithoutFeedback onPress={async () => {
                            if(Object.keys(currentSelected).length>0) {
                                await handleSelectItem(currentSelected)
                            }
                            setPersoFees(!persoFees)
                        }}>
                            <View style={{flexDirection: 'row', alignItems: "center"}}>
                            <View style={{
                                height: 20,
                                width: 20,
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                               {persoFees && <AntDesign name='check' size={24} color='green'/>}
                            </View>
                            <AppText style={{marginLeft: 20, fontWeight: 'bold'}}>A nos magasins</AppText>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    {adresseByUser.length> 0 && <View style={{
                        marginLeft: 20
                    }}>
                    {adresseByUser.map((item, index) =>
                            <PayementListItem
                                libelle={item.nom}
                                description={`${item.tel} --- ${item.adresse}`}
                                key={index}
                                selectItem={() =>handleSelectItem(item)} checked={item.selected} showDelai={false} showDetail={item.showLivraisonDetail}
                                getDetails={() => dispatch(getAdLivraisonDetail(item.id))} isAdLivraison={true}
                                showDetailButton={false}>
                                <AppLabelWithValue label='Tel: ' labelValue={item.tel}/>
                                <AppLabelWithValue label='E-mail: ' labelValue={item.email}/>
                                <AppLabelWithValue label='Autres adresses: ' labelValue={item.adresse}/>
                            </PayementListItem>
                    )}
                    </View>}
                    {adresseByUser.length === 0 &&
                    <View style={styles.emptyStyle}>
                        <AppText>Vous n'avez pas d'adresses de livraison personnelles</AppText>
                    </View>}
                        {isAdresseNotEmpty && <AppButton  style={styles.buttonStyle} title='continuer' onPress={() => {navigation.navigate(routes.ORDER_PAYEMENT)}}/>}
                </ScrollView>
        </View>
            <View style={{
                position: 'absolute',
                right: 10,
                bottom: 10
            }}>
                <ListFooter onPress={() => navigation.navigate('AccueilNavigator', {screen: 'NewUserAdresseScreen', params:{mode:'addNew'}})}/>
            </View>
            </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    summary: {
        margin: 10,
        borderWidth: 1,
        borderRadius: 10
    },
    itemLine: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    adressHeader: {
        backgroundColor: colors.rougeBordeau,
        marginTop: 20,
        marginBottom: 20
    },
    buttonStyle: {
        alignSelf: 'center',
        marginBottom: 30,
        marginTop: 50
    },
    emptyStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20
    }
})

export default OrderLivraisonScreen;