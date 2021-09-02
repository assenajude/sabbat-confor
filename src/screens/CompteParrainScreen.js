import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Alert} from "react-native";
import {MaterialCommunityIcons, MaterialIcons, Entypo} from '@expo/vector-icons';

import AppText from "../components/AppText";
import {useDispatch, useSelector, useStore} from "react-redux";
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {
    createParrainageCompte, getAllParrains,
    getCompteParrainActivate,
    getEditQuotiteSave,
    getInitialEdit, getStartInitialEdit, getStartQuotiteEdit, getUserParrainageCompte, getUserParrains
} from "../store/slices/parrainageSlice";
import AppAvatar from "../components/user/AppAvatar";
import colors from "../utilities/colors";
import routes from "../navigation/routes";
import CompteParrainageItem from "../components/parrainage/CompteParrainageItem";
import useAuth from "../hooks/useAuth";
import ItemSeparator from "../components/list/ItemSeparator";
import AppIconButton from "../components/AppIconButton";

function CompteParrainScreen({navigation}) {

    const dispatch = useDispatch()
    const store = useStore()
    const {userRoleAdmin} = useAuth()

    const user = useSelector(state => state.auth.user)
    const comptesParrain = useSelector(state => state.entities.parrainage.comptes)
    const parrainErreur = useSelector(state => state.entities.parrainage.error)

    const loading = useSelector(state => state.entities.parrainage.loading)
    const [editQuotiteValue, setEditQuotiteValue] = useState('')
    const [editInitialValue, setEditInitialValue] = useState('')

    const handleCreateParrainCompte = async () => {
        if(Object.keys(user).length<=0) {
            Alert.alert('Info', "Vous devez vous connecter avant de creer un compte de parrainage, voulez-vous?"),
                [{text:'oui', onPress: () => navigation.navigate(routes.LOGIN)},
                    {text: 'non', onPress: () => {return;} }]
        }
        await dispatch(createParrainageCompte({userId: user.id}))
        const error = store.getState().entities.parrainage.error
        if(error !== null) {
            alert("Desolé, votre compte n'a pas été créé veuillez reessayer plutard.")
        } else {
            alert("Felicitation, vous avez créé votre compte parrainage avec succès.")
        }
    }

    const handleSaveEditQuotite = async (compteParrain) => {
        if(Number(editQuotiteValue)<= 0) {
            return alert('Veuillez entrer un montant superieur à zero.')
        }
        const solde = compteParrain.initial + compteParrain.gain - compteParrain.depense
        if(Number(editQuotiteValue) > solde) return alert("Vous devez definir une quotité inferieure ou egale à votre fonds disponible")
        await dispatch(getEditQuotiteSave({id:compteParrain.id, quotite: editQuotiteValue}))
        const error = store.getState().entities.parrainage.error
        if(error !== null) return alert("Impossible d'appliquer la quotité, veuillez reessayer")
        dispatch(getStartQuotiteEdit(compteParrain))
        alert("La quotité a été appliquée avec succès")
            setEditQuotiteValue('')

    }

    const handleSaveInitialEdit = async (compteParrain) => {
        if(Number(editInitialValue)<= 0) {
            return alert('Veuillez entrer un montant superieur à zero.')
        }
        const data = {
            id: compteParrain.id,
            initial: Number(editInitialValue)
        }
        await dispatch(getInitialEdit(data))
        const error = store.getState().entities.parrainage.error
        if(error !== null) return alert('Impossible de mettre votre fonds à jour, veuillez reessayer plutard.')
        alert('Fonds ajouté avec succès.')
        setEditInitialValue('')
        dispatch(getStartInitialEdit(compteParrain))
    }

    const handleActiveCompte = (compteParrain) => {
        dispatch(getCompteParrainActivate({id: compteParrain.id}))
        dispatch(getAllParrains())
    }

    useEffect(() => {
        if(Object.keys(user).length > 0 && user.parrainageCompter>0) {
            dispatch(getUserParrainageCompte({userId: user.id}))
            dispatch(getUserParrains({userId: user.id}))
        }
        const allParrains = store.getState().entities.parrainage.searchCompteList
        if(allParrains.length === 0) dispatch(getAllParrains())
    }, [])

    return (
        <>
            <AppActivityIndicator visible={loading}/>
            {!loading && comptesParrain.length === 0 && <View style={styles.noCompteStyle}>
                <AppText>Vous n'avez pas de compte de parrainage</AppText>
                <AppButton
                    iconName='account-plus'
                    title='Créer'
                    onPress={handleCreateParrainCompte}/>
            </View>}
            {!loading && parrainErreur !== null && <View style={styles.noCompteStyle}>
                <AppText>Nous n'avons pas joindre le serveur...Veuillez reessayer plutard</AppText>
            </View>}
            {!loading && comptesParrain.length>0 && <FlatList ItemSeparatorComponent={()=><ItemSeparator/>} data={comptesParrain} keyExtractor={item => item.id.toString()}
                      renderItem={({item}) =>
                          <View style={{paddingTop: 20, backgroundColor: colors.blanc}}>
                              {userRoleAdmin() && <View style={{alignSelf: 'flex-end', marginRight:20}}>
                                  <AppIconButton
                                      buttonContainer={styles.iconButtonStyle}
                                      iconColor={colors.bleuFbi}
                                      onPress={handleCreateParrainCompte}
                                      iconName='account-multiple-plus'/>
                                  <AppIconButton
                                      buttonContainer={[styles.iconButtonStyle, {marginTop: 10}]}
                                      iconColor={colors.vert}
                                      onPress={() => handleActiveCompte(item)}
                                      iconName='account-edit'/>
                              </View>}
                              {!item.active && <View style={styles.inactive}>
                                  <Entypo name="warning" size={24} color={colors.or} />
                                  <View style={{alignItems: 'flex-start'}}>
                                      <AppText>Votre compte sera activé dans 24h.</AppText>
                                      <View style={{flexDirection: 'row'}}>
                                          <AppText>Plus d'information?</AppText>
                                          <TouchableOpacity onPress={() => navigation.navigate(routes.HELP)}>
                                              <AppText style={{color: colors.bleuFbi}}>contactez-nous</AppText>
                                          </TouchableOpacity>
                                      </View>
                                  </View>
                              </View>}
                              <View style={styles.avatarContainer}>
                                  <View style={styles.avatar}>
                                      <AppAvatar
                                          loadingContainer={{
                                              height: 80,
                                              width: 80,
                                              backgroundColor: colors.leger
                                          }}
                                          loadingStyle={{height: 80, width: 80}}
                                          user={item.User}
                                          onPress={() => navigation.navigate(routes.COMPTE, item.User)}
                                          otherImageStyle={{width: 80,height: 80,borderRadius: 40}}/>
                                      <AppText style={{fontWeight: 'bold'}}>{item.User.username}</AppText>
                                  </View>
                                  <View>
                                      <View style={{flexDirection: 'row'}}>
                                          <AppText style={{fontWeight: 'bold'}}>{item.User.nom?item.User.nom:"pas de nom"}</AppText>
                                          {!item.User.nom && <TouchableOpacity onPress={() => navigation.navigate(routes.COMPTE, item.User)}>
                                              <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>Ajouter</AppText>
                                          </TouchableOpacity>}
                                      </View>
                                      <View style={{flexDirection: 'row'}}>
                                          <AppText style={{fontWeight: 'bold'}}>{item.User.prenom?item.User.prenom:"pas de prenom"}</AppText>
                                          {!item.User.prenom && <TouchableOpacity onPress={() => navigation.navigate(routes.COMPTE, item.User)}>
                                              <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>Ajouter</AppText>
                                          </TouchableOpacity>}
                                      </View>
                                  </View>
                              </View>
                              <View style={styles.compteParrain}>
                                  <CompteParrainageItem
                                      fondContainerStyle={{backgroundColor: colors.lightGrey}}
                                      fondsLabel='Fonds initial'
                                      fonds={item.initial}
                                      editFundValue={item.editInitial}
                                      annuleEdit={() => {
                                          setEditInitialValue('')
                                          dispatch(getStartInitialEdit(item))
                                      }} editValue={editInitialValue}
                                      onEditValueChange={val => setEditInitialValue(String(val))}>
                                      {item.editInitial &&
                                          <AppButton
                                              title='Valider'
                                              iconName='content-save'
                                              onPress={()=> handleSaveInitialEdit(item)}
                                          />}
                                      {!item.editInitial &&
                                      <AppButton
                                          title='éditer'
                                          iconName='circle-edit-outline'
                                          onPress={() => {dispatch(getStartInitialEdit(item))
                                          }}/>}
                                  </CompteParrainageItem>
                                  <CompteParrainageItem
                                      fonds={item.gain} fondsLabel='Gain' labelStyle={{color: colors.vert}}
                                      fondContainerStyle={{ backgroundColor: colors.lightGrey}}>
                                      <MaterialCommunityIcons name="credit-card-plus" size={24} color={colors.vert} />
                                  </CompteParrainageItem>
                                  <CompteParrainageItem
                                      fondContainerStyle={{backgroundColor: colors.lightGrey}}
                                      fondsLabel='Depenses'
                                      fonds={item.depense}
                                      labelStyle={{color: colors.rougeBordeau}}>
                                      <MaterialCommunityIcons name="credit-card-minus" size={24} color={colors.rougeBordeau} />
                                  </CompteParrainageItem>
                                  <CompteParrainageItem
                                      fondContainerStyle={{backgroundColor: colors.lightGrey}} fondsLabel='Quotité' fonds={item.quotite}
                                      editFundValue={item.editQuotite}
                                      annuleEdit={() => {
                                          dispatch(getStartQuotiteEdit(item))
                                          setEditQuotiteValue('')
                                      }} editValue={editQuotiteValue}
                                      onEditValueChange={(val) => setEditQuotiteValue(String(val))}>
                                      {!item.editQuotite &&
                                      <AppButton
                                          title='editer'
                                          iconName='circle-edit-outline'
                                          onPress={() => dispatch(getStartQuotiteEdit(item))}/>}
                                      {item.editQuotite &&
                                      <AppButton
                                          title='Valider'
                                          iconName='content-save'
                                          onPress={()=>handleSaveEditQuotite(item)}/>}
                                  </CompteParrainageItem>
                                  <View style={styles.soldeContainer}>
                                      <View style={{flexDirection: 'row'}}>
                                          <MaterialIcons name="account-balance-wallet" size={40} color={colors.vert} />
                                          <AppText style={{color: colors.vert, fontWeight: 'bold'}}>Solde</AppText>
                                      </View>
                                      <AppText style={{color: colors.vert, fontSize: 25, fontWeight: 'bold'}}>{item.solde} fcfa</AppText>
                                  </View>
                              </View>
                          </View>
                      }/>}
            </>
    );
}

const styles = StyleSheet.create({
    noCompteStyle: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.blanc,
        padding: 10
    },
    compteParrain: {
        marginTop: 10
    },
    soldeContainer: {
        flexDirection: 'row',
        backgroundColor: colors.leger,
        justifyContent: 'space-around',
        padding: 40,
        marginVertical: 20,
        marginHorizontal: 25,
        borderRadius: 20
    },
    inactive: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    iconButtonStyle: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: colors.leger
    }
})
export default CompteParrainScreen;